<?php

namespace App\Http\View\Composers;

use Illuminate\View\View;
use App\Models\system_settings;

class SystemSettingsComposer
{
    /**
     * Bind data to the view.
     *
     * @param  \Illuminate\View\View  $view
     * @return void
     */
    public function compose(View $view)
    {
        // Fetch topbar top text from system settings
        $topbarTopText = system_settings::where('key', 'topbar_top_text')
            ->where('status', 'active')
            ->first();

        // Fetch topbar top logo from system settings
        $topbarTopLogo = system_settings::where('key', 'topbar_top_logo')
            ->where('status', 'active')
            ->first();

        $view->with([
            'topbarTopText' => $topbarTopText,
            'topbarTopLogo' => $topbarTopLogo
        ]);
    }
}
