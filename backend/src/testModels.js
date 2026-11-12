import Recipe from "./models/Recipe.js";

async function testModels() {
  let user;

  try {
    await mongoose.connect(process.env.DATABASE_URL);

    console.log("Connected to MongoDB");

    // Create a temporary test user.
    user = await User.create({
      username: `testuser${Date.now()}`,
      password: "temporary-test-placeholder"
    });

    console.log("Created user:", user.username);

    // Create a recipe belonging to the user.
    const recipe = await Recipe.create({
      title: "Pancakes",
      ingredients: ["Flour", "Eggs", "Milk"],
      imageUrl: "https://example.com/pancakes.jpg",
      author: user._id
    });

    console.log("Created recipe:", recipe.title);

    // Find recipes created by this user.
    const recipes = await Recipe.find({
      author: user._id
    });

    console.log("User's recipes:", recipes);
  } catch (error) {
    console.error("Test failed:", error);
    process.exitCode = 1;
  } finally {
    if (user) {
      try {
        await Recipe.deleteMany({ author: user._id });
        await User.deleteOne({ _id: user._id });
        console.log("Test data removed");
      } catch (error) {
        console.error("Cleanup failed:", error);
        process.exitCode = 1;
      }
    }

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

testModels();