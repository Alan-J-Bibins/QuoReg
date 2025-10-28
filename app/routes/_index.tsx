import { Button, Input, Popup, TextArea } from "pixel-retroui";
import { useState } from "react";
import { Form, redirect, useLoaderData, type ActionFunctionArgs } from "react-router";
import { getRandomQuote, newQuote } from "~/database.server"

export const loader = async () => {
    try {
        const quote = await getRandomQuote();
        return { quote }
    } catch (error) {
        console.log("HOLY SHIT ", error);
        return { quote: null }
    }
}

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const newQuoteText = String(formData.get("newQuoteText"))
    const newQuoteAuthor = String(formData.get("newQuoteAuthor"))
    try {
        await newQuote(newQuoteText, newQuoteAuthor)
    } catch (error) {
        console.log(error)
    }

    return redirect("/")
}


export default function Page() {
    const { quote } = useLoaderData<typeof loader>();

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);

    return (
        <div className="flex flex-col gap-4 p-4 h-full">
            <span className="text-6xl shadow-text-sm text-[#BC948F]">
                Wacky Quotes
            </span>
            <div className="text-center shadow-text">
                {quote && (
                    <div className="w-full flex flex-col motion-preset-rebound-down motion-delay-100">
                        <span className="text-8xl">{quote.text}</span>
                        <span className=" text-6xl text-accent text-right w-full shadow-text-sm"> -{quote.author} </span>
                    </div>
                )}
            </div>
            <div className="grow" />
            <div className="w-full flex flex-row-reverse">
                <Button
                    className="!font-sans !text-3xl"
                    onClick={() => openPopup()}
                    bg="#FFDFCF"
                    shadow="#BC948F"
                >
                    Want to add your own quote?
                </Button>
            </div>
            <Popup
                isOpen={isPopupOpen}
                onClose={closePopup}
                bg="#FFDFCF"
                baseBg="#F1818B"
                borderColor="#000000"
                textColor="#312324"
            >
                <Form
                    id="newQuoteForm"
                    method="POST"
                    className="flex flex-col gap-4"
                    onSubmit={() => closePopup()}
                >
                    <h4 className="!text-5xl !font-sans">A New Quote!</h4>
                    <TextArea
                        bg="#FFFFFF"
                        name="newQuoteText"
                        required
                        placeholder="Enter Your Masterpiece"
                    />
                    <div className="flex flex-col">
                        <label className="">Author</label>
                        <Input
                            name="newQuoteAuthor"
                            required
                            placeholder="Enter Your Fine Name"
                            className="!font-sans"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="!text-xl"
                        bg="#F3828C"
                        shadow="#663036"
                    >
                        Submit
                    </Button>
                </Form>
            </Popup>
        </div>
    )
}

