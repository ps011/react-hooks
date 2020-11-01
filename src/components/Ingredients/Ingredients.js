import React, { useReducer, useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import Search from './Search';

const ingredientsReducer = (currentIngredients, action) => {
  switch(action.type){
    case 'SET': {
      return action.ingredients
    }
    case 'ADD': {
      return [...currentIngredients, action.ingredient]
    }
    case 'DELETE': {
      return currentIngredients.filter(ing => ing.id!==action.id)
    }
    default: {
      throw new Error('Something went wrong')
    }
  }
 
}

const Ingredients = () => {
  const [userIngredients, dispatch] = useReducer(ingredientsReducer, [])
  // const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState()

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    dispatch({ type: 'SET', ingredients: filteredIngredients});
  }, []);

  const addIngredientHandler = ingredient => {
    setIsLoading(true);
    fetch('http://localhost:3000/ingredients', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        setIsLoading(false);
        return response.json();
      })
      .then(responseData => {
        dispatch({ type: 'ADD', ingredient})
      });
  };

  const removeIngredientHandler = ingredientId => {
    setIsLoading(true);
    const ingToRemove = userIngredients.find(ingredient => ingredient.id === ingredientId);
    fetch(`http://localhost:3000/ingredients/${ingToRemove.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(_response => {
      setIsLoading(false);
      dispatch({ type: 'DELETE', id: ingredientId })
    }).catch(err => {
      setIsLoading(false);
      setError('Something went wrong')
    })
  };

  const clearError = () => {
    setError(null);
  }

  return (
    <div className="App">
      { error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm onAddIngredient={addIngredientHandler} isLoading={isLoading}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
};

export default Ingredients;
