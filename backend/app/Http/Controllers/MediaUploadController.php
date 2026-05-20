<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MediaUploadController extends Controller
{
    /**
     * Upload a media file (image/video/audio) and return a public URL.
     */
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:102400', // up to 100MB
        ]);

        $file = $request->file('file');
        $path = $file->store('uploads', 'public');

        $url = asset('storage/' . $path);

        return response()->json([
            'success' => true,
            'data' => [
                'path' => $path,
                'url' => $url,
            ],
        ], 201);
    }
}
