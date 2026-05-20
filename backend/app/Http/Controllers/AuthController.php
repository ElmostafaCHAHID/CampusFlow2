<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterRequest;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    private const DEFAULT_ADMIN_EMAIL = 'admin@mostafa.com';
    private const DEFAULT_ADMIN_PASSWORD = 'Most@f@2026';

    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => 'student',
            ]);

            // Create profile for the user
            Profile::create([
                'user_id' => $user->id,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'User registered successfully',
                'user' => $user,
                'token' => $token,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Login a user.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $user = User::where('email', $validated['email'])->first();

            // Automatically create/fix the default admin user when using the known default admin credentials.
            if (!$user && $validated['email'] === self::DEFAULT_ADMIN_EMAIL && $validated['password'] === self::DEFAULT_ADMIN_PASSWORD) {
                $user = User::create([
                    'name' => 'Mostafa Admin',
                    'email' => self::DEFAULT_ADMIN_EMAIL,
                    'password' => Hash::make(self::DEFAULT_ADMIN_PASSWORD),
                    'role' => 'admin',
                ]);

                Profile::create([
                    'user_id' => $user->id,
                    'bio' => 'System administrator for CampusFlow.',
                ]);
            }

            if ($user && !Hash::check($validated['password'], $user->password)) {
                if ($user->email === self::DEFAULT_ADMIN_EMAIL && $validated['password'] === self::DEFAULT_ADMIN_PASSWORD) {
                    $user->password = Hash::make(self::DEFAULT_ADMIN_PASSWORD);
                    $user->save();
                } else {
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid credentials',
                    ], 401);
                }
            }

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials',
                ], 401);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => $user,
                'token' => $token,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Logout a user.
     */
    public function logout(): JsonResponse
    {
        try {
            auth()->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logout successful',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
