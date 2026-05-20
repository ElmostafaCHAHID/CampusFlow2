<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    /**
     * Display a listing of categories.
     */
    public function index(): JsonResponse
    {
        $categories = Category::with('articles')->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ], 200);
    }

    /**
     * Store a newly created category.
     */
    public function store(StoreCategoryRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();
            $category = Category::create([
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Category created successfully',
                'data' => $category,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create category',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display the specified category.
     */
    public function show(Category $category): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $category->load('articles.user'),
        ], 200);
    }

    /**
     * Update the specified category.
     */
    public function update(UpdateCategoryRequest $request, Category $category): JsonResponse
    {
        try {
            $validated = $request->validated();
            $category->update([
                'name' => $validated['name'],
                'slug' => Str::slug($validated['name']),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully',
                'data' => $category,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update category',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove the specified category.
     */
    public function destroy(Category $category): JsonResponse
    {
        try {
            $category->delete();

            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete category',
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
