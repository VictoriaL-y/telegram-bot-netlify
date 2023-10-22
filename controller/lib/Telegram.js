const { axiosInstance } = require("./axios");
const Ingredient = require("../../models/ingredient")

let ingredientName = "";
let waitingForIngredientName = false
let waitingForIngredientWeight = false

let measurements = {
    flour: {
        cup: {
            "1": 120,
            "3/4": 90,
            "¾": 90,
            "2/3": 80,
            "⅔": 80,
            "1/2": 60,
            "½": 60,
            "1/3": 40,
            "⅓": 40,
            "1/4": 30,
            "¼": 30
        },
        tbsp: {
            "1": 7.5
        }
    },
    sugar: {
        cup: {
            "1": 200,
        },
        tbsp: {
            "1": 12.5
        }

    },

    "icing sugar": {
        cup: {
            "1": 100,
        },
        tbsp: {
            "1": 6.5
        }
    },

    "brown sugar": {
        cup: {
            "1": 180,
        },
        tbsp: {
            "1": 11.5
        }
    },

}

// get all the ingredients from the database
// function getIngredientsList() {
//     Ingredient.find()
//     .then((result) => {
//         console.log(result[0].name + " is my result");
//         // const resultStringified = JSON.stringify(result);
//         let ingredientsList = ""
//         console.log(result.length + " is length")

//         for (let ingredient of result) {
//             console.log(result.indexOf(ingredient) + " " + result)
//             if (result.indexOf(ingredient) === result.length - 1) {
//                 ingredientsList += ingredient.name;
//             } else {
//                 ingredientsList += ingredient.name + "\n";
//             }
//         }

//         return ingredientsList;

//     })
//     .catch((err) => {
//         console.log(err);
//     });
// }

function sendMessage(messageObj, messageText) {
    return axiosInstance.get("sendMessage", {
        chat_id: messageObj.chat.id,
        text: messageText,
    });
}

function handleMessage(messageObj) {
    const messageText = messageObj.text || "";

    if (messageText.charAt(0) === "/") {
        const command = messageText.substr(1);
        switch (command) {
            case "start":
                waitingForIngredientName = false;
                waitingForIngredientWeight = false;
                // send a welcome message to the user
                return sendMessage(
                    messageObj,
                    "Hi! I'm a bot who can help you to convert ingredients quantity from US measurements to EU"
                );
            case "help":
                waitingForIngredientName = false;
                waitingForIngredientWeight = false;
                // send an instruction message
                return sendMessage(
                    messageObj,
                    "Send me a list of ingredients to convert (tsp, tbs, cup -> grams). It should be a text."
                );
            case "all":
                waitingForIngredientName = false;
                waitingForIngredientWeight = false;
                // get all the ingredients from the database
                Ingredient.find()
                    .then((result) => {
                        let ingredientsList = ""
                        console.log(result.length + " is length")

                        for (let ingredient of result) {
                            console.log(result.indexOf(ingredient) + " " + result)
                            if (result.indexOf(ingredient) === result.length - 1) {
                                ingredientsList += ingredient.name;
                            } else {
                                ingredientsList += ingredient.name + "\n";
                            }
                        }
                        return sendMessage(
                            messageObj, ingredientsList);

                    })
                    .catch((err) => {
                        console.log(err);
                    });
                break;
            case "add":
                // add new ingredient to the conversion table

                waitingForIngredientName = true;
                waitingForIngredientWeight = false;

                return sendMessage(messageObj,
                    "Which ingredient do you want to add to my table?");

            default:
                return sendMessage(messageObj,
                    "Hey, I don't know this command");
        }

    } else if (!messageText) {
        if (waitingForIngredientName) {
            return sendMessage(messageObj, "Please type the name of the ingredient");
        } else if (waitingForIngredientWeight) {
            return sendMessage(messageObj, "Please type the weight of the ingredient");
        }
        return sendMessage(messageObj, "I can't convert this");
    } else if (waitingForIngredientName) {
        console.log("I'm here")
        waitingForIngredientName = false;

        Ingredient.find()
            .then((result) => {

                for (let ingredient of result) {
                    if (ingredient.name === messageText) {
                        return sendMessage(
                            messageObj, "This ingredient is already in the table. You can just start to convert your ingredients");
                    }
                }

                ingredientName = messageText;
                waitingForIngredientWeight = true;
                return sendMessage(
                    messageObj, "How many grams of it are in a US cup?");
            });

    } else if (waitingForIngredientWeight) {
        if (!isNaN(messageText)) {

            const ingredient = new Ingredient({
                name: ingredientName,
                cup: messageText
            });

            ingredient.save()
                .then(() => {
                    return sendMessage(messageObj, "The ingredient <b>" + ingredientName + "</b> was successfully added!");
                })
                .catch((err) => {
                    console.log(err);
                })

        } else {
            return sendMessage(messageObj, "Please, indicate the weight in numbers");
        }
    } else {
        //convert a recipe and send it back to the user
        const recipe = getConvertedRecipe(messageText);

        console.log(recipe);
        console.log(typeof (messageText));
        return sendMessage(messageObj, recipe);
    }
}

function getConvertedRecipe(messageText) {
    console.log("higgg")
    let recipeInGramsArr = [];
    let amount;
    let newWeight;
    let oldWeight;
    const recipeArr = messageText.toLowerCase()
        .replace("cups", "cup")
        .replace("tablespoons", "tbsp")
        .replace("tablespoon", "tbsp")
        .replace("teaspoons", "tsp")
        .replace("teaspoon", "tsp")
        // .replace("⅔", "2/3")
        // .replace("¾", "3/4")
        // .replace("½", "1/2")
        // .replace("⅓", "1/3")
        // .replace("¼", "1/4")
        .split("\n") // get like [ '2 1/2 cup flour', '3 tbsp sugar' ]
    console.log(recipeArr)

    for (let ingredient of recipeArr) {
        let ingredientArr = ingredient.replace(/[&#,+()$~%.'":*?<>{}]/g, "").split(/\s/); // get like [ '2', '1/2', 'cup', 'flour' ]
        let ingredientArrWithSigns = ingredient.split(/\s/);
        console.log(ingredient + " is an ingredient")

        const [measurementContainer, indexOfContainer] = getMeasurementContainerAndIndex(ingredientArr);
        if (indexOfContainer === -1) {
            recipeInGramsArr.push(ingredientArrWithSigns.join(" "));
            continue;
        }
        const product = getProductName(ingredientArr);
        if (product === false) {
            recipeInGramsArr.push(ingredientArrWithSigns.join(" "));
            continue;
        }


        if (indexOfContainer === 1) {
            amount = ingredientArr[0];
            oldWeight = amount;
            if (ingredientArr[0].split('/').length === 1) {
                newWeight = parseInt(amount) * measurements[product][measurementContainer]["1"];
            } else {
                newWeight = measurements[product][measurementContainer][amount];
            }

        } else if (indexOfContainer === 2) {
            let amountWhole = ingredientArr[0];
            let amountFract = ingredientArr[1];
            oldWeight = amountWhole + " " + amountFract;
            newWeight = parseInt(amountWhole) * measurements[product][measurementContainer]["1"]
                + measurements[product][measurementContainer][amountFract];
        }

        const convertedIngredient = ingredientArrWithSigns.join(' ')
            .replace(oldWeight, newWeight)
            .replace(measurementContainer, "gr");
        recipeInGramsArr.push(convertedIngredient);


    }
    const recipe = recipeInGramsArr.join('\n');
    // if (recipeInGramsArr.length === 0) {
    //     return "I can't convert this recipe"
    // }
    return recipe;
}

function getMeasurementContainerAndIndex(ingredientArr) {
    let measurementContainer = "cup";
    let indexOfContainer = ingredientArr.indexOf("cup") // index of 'cup' is 2
    console.log(ingredientArr[1])

    if (indexOfContainer < 0) {
        measurementContainer = "tbsp";
        indexOfContainer = ingredientArr.indexOf("tbsp");
        if (indexOfContainer < 0) {
            measurementContainer = "tsp";
            indexOfContainer = ingredientArr.indexOf("tsp");
            if (indexOfContainer < 0) {
                console.log(indexOfContainer + " is index " + measurementContainer)
                return ["no container", -1];
            }
        }
        console.log(measurementContainer + " has index " + indexOfContainer)
    }
    return [measurementContainer, indexOfContainer];
}

function getProductName(ingredientArr) {
    console.log(ingredientArr)
    if (ingredientArr.includes('flour')) {
        product = "flour";
    } else if (ingredientArr.includes("sugar")) {
        if (ingredientArr.includes('icing')
            || ingredientArr.includes("confectioners")
            || ingredientArr.includes("confectioners’")
            || ingredientArr.includes("confectioners'")
            || ingredientArr.includes("powder")
            || ingredientArr.includes("powdered")) {
            product = "icing sugar"
        } else if (ingredientArr.includes("brown")) {
            product = "brown sugar";
        } else {
            product = "sugar";
        }
    } else {
        return false;
    }
    console.log(product + " is product")
    return product;
}

module.exports = { handleMessage };

