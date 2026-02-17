<?php

namespace App\Http\Controllers;

use App\Jobs\SendModerationNotification;
use App\Models\City;
use App\Models\CommunityPage;
use App\Models\CommunityPageClaim;
use App\Models\ModerationAction;
use App\Models\Ride;
use App\Models\Sale;
use App\Models\SaleRelayAddress;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ModerationActionController extends Controller
{
    private function validReasonCodes(): string
    {
        $codes = ModerationAction::reasonCodes();
        return implode(',', $codes !== [] ? array_keys($codes) : ['OTHER']);
    }

    public function approveSale(Request $request, string $city, Sale $sale): RedirectResponse
    {
        $citySlug = $city;
        $cityModel = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $cityModel);
        if ($sale->city_id !== $cityModel->id || $sale->state !== Sale::STATE_PENDING_REVIEW) {
            abort(404);
        }
        $request->validate([
            'reason_code' => ['required', 'string', 'in:' . $this->validReasonCodes()],
            'relay_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $previous = $sale->state;
        $sale->update(['state' => Sale::STATE_PUBLISHED, 'published_at' => now()]);
        $sale->searchable();
        if (! $sale->relayAddress) {
            SaleRelayAddress::create(['sale_id' => $sale->id, 'token' => SaleRelayAddress::generateToken()]);
        }
        $this->recordAndNotify($request->user(), $sale, 'published', $previous, Sale::STATE_PUBLISHED, $request->input('reason_code'), null, $request->input('relay_message'));
        return redirect()->to(self::cityBaseUrl($request, $citySlug) . '/moderation/sales')->with('status', 'Sale published.');
    }

    public function revertSale(Request $request, string $city, Sale $sale): RedirectResponse
    {
        $citySlug = $city;
        $cityModel = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $cityModel);
        if ($sale->city_id !== $cityModel->id) {
            abort(404);
        }
        $request->validate([
            'reason_code' => ['required', 'string', 'in:' . $this->validReasonCodes()],
            'moderation_note' => ['required', 'string', 'max:2000'],
            'relay_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $previous = $sale->state;
        $sale->update(['state' => Sale::STATE_DRAFT]);
        $sale->unsearchable();
        $this->recordAndNotify($request->user(), $sale, 'reverted_to_draft', $previous, Sale::STATE_DRAFT, $request->input('reason_code'), $request->input('moderation_note'), $request->input('relay_message'));
        return redirect()->to(self::cityBaseUrl($request, $citySlug) . '/moderation/sales')->with('status', 'Sale reverted to draft.');
    }

    public function removeSale(Request $request, string $city, Sale $sale): RedirectResponse
    {
        $citySlug = $city;
        $cityModel = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $cityModel);
        if ($sale->city_id !== $cityModel->id) {
            abort(404);
        }
        $request->validate([
            'reason_code' => ['required', 'string', 'in:' . $this->validReasonCodes()],
            'relay_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $previous = $sale->state;
        $sale->update(['state' => Sale::STATE_REMOVED]);
        $sale->unsearchable();
        $this->recordAndNotify($request->user(), $sale, 'removed', $previous, Sale::STATE_REMOVED, $request->input('reason_code'), null, $request->input('relay_message'));
        return redirect()->to(self::cityBaseUrl($request, $citySlug) . '/moderation/sales')->with('status', 'Removed by moderator.');
    }

    public function approveRide(Request $request, string $city, Ride $ride): RedirectResponse
    {
        $citySlug = $city;
        $cityModel = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $cityModel);
        if ($ride->city_id !== $cityModel->id || $ride->state !== Ride::STATE_PENDING_REVIEW) {
            abort(404);
        }
        $request->validate([
            'reason_code' => ['required', 'string', 'in:' . $this->validReasonCodes()],
            'relay_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $previous = $ride->state;
        $ride->update(['state' => Ride::STATE_PUBLISHED, 'published_at' => now()]);
        $this->recordAndNotifyRide($request->user(), $ride, 'published', $previous, Ride::STATE_PUBLISHED, $request->input('reason_code'), null, $request->input('relay_message'));
        return redirect()->to(self::cityBaseUrl($request, $citySlug) . '/moderation/rides')->with('status', 'Ride published.');
    }

    public function revertRide(Request $request, string $city, Ride $ride): RedirectResponse
    {
        $citySlug = $city;
        $cityModel = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $cityModel);
        if ($ride->city_id !== $cityModel->id) {
            abort(404);
        }
        $request->validate([
            'reason_code' => ['required', 'string', 'in:' . $this->validReasonCodes()],
            'moderation_note' => ['required', 'string', 'max:2000'],
            'relay_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $previous = $ride->state;
        $ride->update(['state' => Ride::STATE_DRAFT]);
        $this->recordAndNotifyRide($request->user(), $ride, 'reverted_to_draft', $previous, Ride::STATE_DRAFT, $request->input('reason_code'), $request->input('moderation_note'), $request->input('relay_message'));
        return redirect()->to(self::cityBaseUrl($request, $citySlug) . '/moderation/rides')->with('status', 'Ride reverted to draft.');
    }

    public function removeRide(Request $request, string $city, Ride $ride): RedirectResponse
    {
        $citySlug = $city;
        $cityModel = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $cityModel);
        if ($ride->city_id !== $cityModel->id) {
            abort(404);
        }
        $request->validate([
            'reason_code' => ['required', 'string', 'in:' . $this->validReasonCodes()],
            'relay_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $previous = $ride->state;
        $ride->update(['state' => Ride::STATE_REMOVED]);
        $this->recordAndNotifyRide($request->user(), $ride, 'removed', $previous, Ride::STATE_REMOVED, $request->input('reason_code'), null, $request->input('relay_message'));
        return redirect()->to(self::cityBaseUrl($request, $citySlug) . '/moderation/rides')->with('status', 'Removed by moderator.');
    }

    public function approvePage(Request $request, string $city, CommunityPage $page): RedirectResponse
    {
        $citySlug = $city;
        $cityModel = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $cityModel);
        if ($page->city_id !== $cityModel->id || $page->state !== CommunityPage::STATE_PENDING) {
            abort(404);
        }
        $request->validate([
            'reason_code' => ['required', 'string', 'in:' . $this->validReasonCodes()],
            'relay_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $previous = $page->state;
        $page->update(['state' => CommunityPage::STATE_APPROVED]);
        $this->recordAndNotifyPage($request->user(), $page, 'published', $previous, CommunityPage::STATE_APPROVED, $request->input('reason_code'), null, $request->input('relay_message'));
        return redirect()->to(self::cityBaseUrl($request, $citySlug) . '/moderation/pages')->with('status', 'Page approved.');
    }

    public function revertPage(Request $request, string $city, CommunityPage $page): RedirectResponse
    {
        $citySlug = $city;
        $cityModel = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $cityModel);
        if ($page->city_id !== $cityModel->id) {
            abort(404);
        }
        $request->validate([
            'reason_code' => ['required', 'string', 'in:' . $this->validReasonCodes()],
            'moderation_note' => ['required', 'string', 'max:2000'],
            'relay_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $previous = $page->state;
        $page->update(['state' => CommunityPage::STATE_PENDING]);
        $this->recordAndNotifyPage($request->user(), $page, 'reverted_to_draft', $previous, CommunityPage::STATE_PENDING, $request->input('reason_code'), $request->input('moderation_note'), $request->input('relay_message'));
        return redirect()->to(self::cityBaseUrl($request, $citySlug) . '/moderation/pages')->with('status', 'Page reverted to pending.');
    }

    public function removePage(Request $request, string $city, CommunityPage $page): RedirectResponse
    {
        $citySlug = $city;
        $cityModel = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $cityModel);
        if ($page->city_id !== $cityModel->id) {
            abort(404);
        }
        $request->validate([
            'reason_code' => ['required', 'string', 'in:' . $this->validReasonCodes()],
            'relay_message' => ['nullable', 'string', 'max:2000'],
        ]);

        $previous = $page->state;
        $page->update(['state' => CommunityPage::STATE_REMOVED]);
        $this->recordAndNotifyPage($request->user(), $page, 'removed', $previous, CommunityPage::STATE_REMOVED, $request->input('reason_code'), null, $request->input('relay_message'));
        return redirect()->to(self::cityBaseUrl($request, $citySlug) . '/moderation/pages')->with('status', 'Removed by moderator.');
    }

    private function recordAndNotify($user, Sale $subject, string $action, string $previousState, string $newState, string $reasonCode, ?string $moderationNote, ?string $relayMessage): void
    {
        $codes = config('moderation.reason_codes', []);
        $reasonLabel = $codes[$reasonCode] ?? $reasonCode;
        ModerationAction::create([
            'user_id' => $user->id,
            'actor_role' => ModerationAction::actorRoleForUser($user),
            'action' => $action,
            'subject_type' => Sale::class,
            'subject_id' => $subject->id,
            'reason_code' => $reasonCode,
            'moderation_note' => $moderationNote,
            'metadata' => $relayMessage ? ['relay_message' => $relayMessage] : null,
            'previous_state' => $previousState,
            'new_state' => $newState,
        ]);
        $creatorEmail = $subject->user?->email;
        if ($creatorEmail) {
            SendModerationNotification::dispatch($creatorEmail, $this->actionLabel($action), 'For Sale listing', $reasonLabel, $relayMessage);
        }
    }

    private function recordAndNotifyRide($user, Ride $subject, string $action, string $previousState, string $newState, string $reasonCode, ?string $moderationNote, ?string $relayMessage): void
    {
        $codes = config('moderation.reason_codes', []);
        $reasonLabel = $codes[$reasonCode] ?? $reasonCode;
        ModerationAction::create([
            'user_id' => $user->id,
            'actor_role' => ModerationAction::actorRoleForUser($user),
            'action' => $action,
            'subject_type' => Ride::class,
            'subject_id' => $subject->id,
            'reason_code' => $reasonCode,
            'moderation_note' => $moderationNote,
            'metadata' => $relayMessage ? ['relay_message' => $relayMessage] : null,
            'previous_state' => $previousState,
            'new_state' => $newState,
        ]);
        $creatorEmail = $subject->user?->email;
        if ($creatorEmail) {
            SendModerationNotification::dispatch($creatorEmail, $this->actionLabel($action), 'Ride', $reasonLabel, $relayMessage);
        }
    }

    private function recordAndNotifyPage($user, CommunityPage $subject, string $action, string $previousState, string $newState, string $reasonCode, ?string $moderationNote, ?string $relayMessage): void
    {
        $codes = config('moderation.reason_codes', []);
        $reasonLabel = $codes[$reasonCode] ?? $reasonCode;
        ModerationAction::create([
            'user_id' => $user->id,
            'actor_role' => ModerationAction::actorRoleForUser($user),
            'action' => $action,
            'subject_type' => CommunityPage::class,
            'subject_id' => $subject->id,
            'reason_code' => $reasonCode,
            'moderation_note' => $moderationNote,
            'metadata' => $relayMessage ? ['relay_message' => $relayMessage] : null,
            'previous_state' => $previousState,
            'new_state' => $newState,
        ]);
        $creator = $subject->createdByUser ?? $subject->claimedByUser;
        $creatorEmail = $creator?->email;
        if ($creatorEmail) {
            SendModerationNotification::dispatch($creatorEmail, $this->actionLabel($action), 'Community page', $reasonLabel, $relayMessage);
        }
    }

    public function approveClaim(Request $request, string $city, CommunityPageClaim $claim): RedirectResponse
    {
        $citySlug = $city;
        $cityModel = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $cityModel);
        if ($claim->communityPage->city_id !== $cityModel->id || $claim->status !== CommunityPageClaim::STATUS_PENDING) {
            abort(404);
        }
        $request->validate([
            'reason_code' => ['required', 'string', 'in:' . $this->validReasonCodes()],
            'relay_message' => ['nullable', 'string', 'max:2000'],
        ]);
        $claim->update([
            'status' => CommunityPageClaim::STATUS_APPROVED,
            'reviewed_by_user_id' => $request->user()->id,
            'reviewed_at' => now(),
        ]);
        $claim->communityPage->managers()->syncWithoutDetaching([$claim->user_id => ['role' => 'manager']]);
        $claim->communityPage->update(['claimed_by_user_id' => $claim->user_id]);
        $reasonCode = $request->input('reason_code');
        $codes = config('moderation.reason_codes', []);
        $reasonLabel = $codes[$reasonCode] ?? $reasonCode;
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'actor_role' => ModerationAction::actorRoleForUser($request->user()),
            'action' => 'claim_approved',
            'subject_type' => CommunityPageClaim::class,
            'subject_id' => $claim->id,
            'reason_code' => $reasonCode,
            'previous_state' => CommunityPageClaim::STATUS_PENDING,
            'new_state' => CommunityPageClaim::STATUS_APPROVED,
        ]);
        if ($claim->user?->email) {
            SendModerationNotification::dispatch($claim->user->email, 'Approved', 'Community page claim', $reasonLabel, $request->input('relay_message'));
        }
        return redirect()->to(self::cityBaseUrl($request, $citySlug) . '/moderation/claims')->with('status', 'Claim approved.');
    }

    public function rejectClaim(Request $request, string $city, CommunityPageClaim $claim): RedirectResponse
    {
        $citySlug = $city;
        $cityModel = City::query()->where('slug', $citySlug)->firstOrFail();
        $this->authorizeModerator($request->user(), $cityModel);
        if ($claim->communityPage->city_id !== $cityModel->id || $claim->status !== CommunityPageClaim::STATUS_PENDING) {
            abort(404);
        }
        $request->validate([
            'reason_code' => ['required', 'string', 'in:' . $this->validReasonCodes()],
            'relay_message' => ['nullable', 'string', 'max:2000'],
        ]);
        $reasonCode = $request->input('reason_code');
        $codes = config('moderation.reason_codes', []);
        $reasonLabel = $codes[$reasonCode] ?? $reasonCode;
        $claim->update([
            'status' => CommunityPageClaim::STATUS_REJECTED,
            'reviewed_by_user_id' => $request->user()->id,
            'reviewed_at' => now(),
        ]);
        ModerationAction::create([
            'user_id' => $request->user()->id,
            'actor_role' => ModerationAction::actorRoleForUser($request->user()),
            'action' => 'claim_rejected',
            'subject_type' => CommunityPageClaim::class,
            'subject_id' => $claim->id,
            'reason_code' => $reasonCode,
            'previous_state' => CommunityPageClaim::STATUS_PENDING,
            'new_state' => CommunityPageClaim::STATUS_REJECTED,
        ]);
        if ($claim->user?->email) {
            SendModerationNotification::dispatch($claim->user->email, 'Rejected', 'Community page claim', $reasonLabel, $request->input('relay_message'));
        }
        return redirect()->to(self::cityBaseUrl($request, $citySlug) . '/moderation/claims')->with('status', 'Claim rejected.');
    }

    private function actionLabel(string $action): string
    {
        return match ($action) {
            'published' => 'Published',
            'approved' => 'Approved',
            'reverted_to_draft' => 'Reverted to draft',
            'removed' => 'Removed',
            default => $action,
        };
    }

    private function authorizeModerator($user, City $city): void
    {
        if (! $user || ! $user->canModerateCity($city)) {
            abort(403, 'Not authorized to moderate this city.');
        }
    }
}
