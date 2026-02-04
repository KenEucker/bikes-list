<div class="row">
    <div class="col-12">
        <table class="table table-bordered">
            <tr><th>Name</th><td>{{ $guideline->name }}</td></tr>
            <tr><th>Scope</th><td>{{ $guideline->scope }}</td></tr>
            <tr><th>City</th><td>{{ $guideline->city?->name ?? '—' }}</td></tr>
            <tr><th>Published at</th><td>{{ $guideline->published_at->toDateTimeString() }}</td></tr>
            <tr><th>Archived at</th><td>{{ $guideline->archived_at?->toDateTimeString() ?? '—' }}</td></tr>
            <tr><th>Body</th><td><div class="prose">{{ nl2br(e($guideline->body)) }}</div></td></tr>
        </table>
    </div>
</div>
