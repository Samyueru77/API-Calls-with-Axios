import React, { useState, useEffect } from "react";
import axios from "axios";

function RecipeForm() {
  const [recipes, setRecipes] = useState([]);
  const [name, setName] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [favorite, setFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [editItem, setEditItem] = useState(null);

  useEffect(() => {
    axios
     .get("https://serverless-api-mazon.netlify.app/.netlify/functions/api")
     .then((response) => {
        setRecipes(response.data);
      })
     .catch((error) => {
        console.error("There was an error!", error);
        setError("Failed to fetch recipes");
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name ||!cuisine ||!ingredients) {
      setError("Name, cuisine, and ingredients are required");
      return;
    }

    const url = editItem
     ? `https://serverless-api-mazon.netlify.app/.netlify/functions/api/${editItem._id}`
      : "https://serverless-api-mazon.netlify.app/.netlify/functions/api";
    const method = editItem? "put" : "post";

    const recipeData = { name, cuisine, ingredients, favorite };

    axios[method](url, recipeData)
     .then((response) => {
        console.log(response.data);

        if (editItem) {
          // If editing, update the edited recipe in the state
          setRecipes((prevRecipes) =>
            prevRecipes.map((recipe) =>
              recipe._id === editItem._id? response.data : recipe
            )
          );
        } else {
          // If adding a new recipe, append it to the existing list in the state
          setRecipes((prevRecipes) => [...prevRecipes, response.data]);
        }
        // Reset form fields and error message
        setName("");
        setCuisine("");
        setIngredients("");
        setFavorite(false);
        setEditItem(null);
        setError(null);
      })
     .catch((error) => {
        console.error("There was an error!", error);
        setError("There was an error submitting the data");
      });
  };

  const handleEdit = (_id) => {
    const recipeToEdit = recipes.find((recipe) => recipe._id === _id);
    setEditItem(recipeToEdit);
    setName(recipeToEdit.name);
    setCuisine(recipeToEdit.cuisine);
    setIngredients(recipeToEdit.ingredients);
    setFavorite(recipeToEdit.favorite);
  };

  const handleDelete = (_id) => {
    axios
     .delete(`https://serverless-api-mazon.netlify.app/.netlify/functions/api/${_id}`)
     .then(() => {
        setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe._id!== _id));
      })
     .catch((error) => {
        console.error("There was an error!", error);
        setError("There was an error deleting the recipe");
      });
  };

  return (
    <div className="recipe-form-container">
      <style>{`
      body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-image: url('https://images.unsplash.com/photo-1514933651103-005eec06c04b');
    background-size: cover;
    background-position: center;
    height: 100vh;
  }

  /* Recipe form container */
  .recipe-form-container {
    max-width: 600px;
    margin: 40px auto;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    opacity: 3; 
  }

  /* Form styles */
  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 20px;
    width: 100%;
    opacity: 1; 
  }

  input, textarea {
    padding: 12px;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    font-size: 16px;
    transition: border-color 0.2s;
    width: 100%;
  }

  input:focus, textarea:focus {
    border-color: #007bff;
    outline: none;
  }

  button {
    padding: 12px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 100%;
  }

  button:hover {
    background-color: #0056b3;
  }

  /* Recipe list styles */
  ul {
    list-style: none;
    padding: 0;
    width: 100%;
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #e0e0e0;
    width: 100%;
  }

  li:last-child {
    border-bottom: none;
  }

  .button-group {
    display: flex;
    gap: 12px;
  }

  .edit-button, .delete-button {
    padding: 8px;
    border: none;
    border-radius: 4px;
    background-color: #007bff;
    color: white;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .edit-button:hover, .delete-button:hover {
    background-color: #0056b3;
  }

  /* Error message styles */
  .error-message {
    color: red;
    font-size: 14px;
    margin-bottom: 10px;
    width: 100%;
    text-align: center;
  }
      }
      `}</style>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Cuisine:
          <input type="text" value={cuisine} onChange={(e) => setCuisine(e.target.value)} />
        </label>
        <label>
          Ingredients:
          <textarea value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
        </label>
        <label>
          Favorite:
          <input type="checkbox" checked={favorite} onChange={(e) => setFavorite(e.target.checked)} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {error && <div className="error-message">{error}</div>}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe._id}>
            {recipe.name} - {recipe.cuisine}
            <div>Ingredients: {recipe.ingredients}</div>
            <div className="button-group">
              <button className="edit-button" onClick={() => handleEdit(recipe._id)}>Edit</button>
              <button className="delete-button" onClick={() => handleDelete(recipe._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RecipeForm;