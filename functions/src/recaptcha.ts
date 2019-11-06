import { functions } from "./firebase";

export const reCaptcha = functions.https.onCall(async (data, context) => {

    const body = {
        secret: '6LfrZ7wUAAAAAHzfUqbZv-hj8AbU7GGpXmRRA0d3',
        response: data.token
    };
    const result = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${body.secret}&response=${body.response}`,
    })
    return result.json();
});
