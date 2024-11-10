import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_ROLE_KEY
);

export async function PUT(req) {
  try {
    console.log("Received PUT request");
    const { id, data, categories } = await req.json();
    console.log("Request data:", { id, data, categories });

    // Update the `products` table
    const { error: productUpdateError } = await supabase
      .from("products")
      .update({
        name: data.name,
        brand: data.brand,
        price: data.price,
        quantity: data.quantity,
        description: data.description,
      })
      .eq("id", id);

    if (productUpdateError) {
      console.error("Error updating product:", productUpdateError.message);
      throw new Error(productUpdateError.message);
    }
    console.log("Product updated successfully");

    const { data: categoryData, error: categoryFetchError } = await supabase
      .from("categories")
      .select("id, slug")
      .in("slug", categories);

    if (categoryFetchError) {
      console.error("Error fetching category IDs:", categoryFetchError.message);
      throw new Error(categoryFetchError.message);
    }
    console.log("Fetched category data:", categoryData);

    const categoryIds = categoryData.map((category) => category.id);

    // Fetch existing relationships
    const { data: existingCategories, error: existingFetchError } =
      await supabase
        .from("product_categories")
        .select("category")
        .eq("product", id);

    if (existingFetchError) {
      console.error(
        "Error fetching existing categories:",
        existingFetchError.message
      );
      throw new Error(existingFetchError.message);
    }
    console.log("Existing categories:", existingCategories);

    const existingCategoryIds = existingCategories.map((cat) => cat.category);

    // Calculate categories to add and remove
    const categoriesToAdd = categoryIds.filter(
      (catId) => !existingCategoryIds.includes(catId)
    );
    const categoriesToRemove = existingCategoryIds.filter(
      (catId) => !categoryIds.includes(catId)
    );

    console.log("Categories to add:", categoriesToAdd);
    console.log("Categories to remove:", categoriesToRemove);

    // Insert new relationships
    if (categoriesToAdd.length > 0) {
      const { error: insertError } = await supabase
        .from("product_categories")
        .insert(
          categoriesToAdd.map((catId) => ({ product: id, category: catId }))
        );

      if (insertError) {
        console.error("Error inserting new categories:", insertError.message);
        throw new Error(insertError.message);
      }
      console.log("Inserted new categories successfully");
    }

    // Remove outdated relationships
    if (categoriesToRemove.length > 0) {
      const { error: deleteError } = await supabase
        .from("product_categories")
        .delete()
        .eq("product", id)
        .in("category", categoriesToRemove);

      if (deleteError) {
        console.error("Error deleting old categories:", deleteError.message);
        throw new Error(deleteError.message);
      }
      console.log("Removed old categories successfully");
    }

    console.log("Product update operation completed successfully");
    return new Response(
      JSON.stringify({ message: "Product updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PUT operation:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}
