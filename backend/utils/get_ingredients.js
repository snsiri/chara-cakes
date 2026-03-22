
async function getIngredients() {
    try {
        const ingredients = await ingredients.find()
            .populate('Product_ingredients.IngredientStock', '_id','name','stock_quantity','unit') // Populate product details
            .exec();

        console.log(ingredients);
    } catch (error) {
        console.error(error);
    }
}

getIngredients();