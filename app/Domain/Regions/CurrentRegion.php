<?php

namespace App\Domain\Regions;

class CurrentRegion
{
    protected ?Region $region = null;

    /**
     * Get the current region.
     */
    public function get(): ?Region
    {
        return $this->region;
    }

    /**
     * Require the current region (throw if not set).
     */
    public function require(): Region
    {
        if ($this->region === null) {
            abort(404, 'Region not found');
        }

        return $this->region;
    }

    /**
     * Set the current region.
     */
    public function set(Region $region): void
    {
        $this->region = $region;
    }

    /**
     * Clear the current region.
     */
    public function clear(): void
    {
        $this->region = null;
    }
}
