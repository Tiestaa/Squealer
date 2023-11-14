import { Field, Formik, Form, useFormikContext} from 'formik';
import * as Yup from "yup";
import { Button } from "@material-tailwind/react";

function AddPost () {

    const initialValues = {
        contentType: "text",
        destinatari: "",
        testo: "",
        foto: "",
        video: "",
        geolocation: ""
    };

    const validationSchema = Yup.object().shape({
        destinatari: Yup.string()
            .required("Inserisci i destinatari"),

        testo: Yup.string().when("contentType",{
            is: "text",
            then: () => Yup.string().required("Inserisci contenuto")
        }),
        foto: Yup.string().when("contentType",{
            is: "image",
            then: () => Yup.string().required("Inserisci una foto")
        }),
        video: Yup.string().when("contentType", {
            is: "video",
            then: () => Yup.string().required("Inserisci l'url")
        })
    });

    function parseDestinations(destinations) {
        let finalDest = [];
        let allDest = destinations.split(",");
        for (let dest of allDest) {
            dest = dest.trim();
            finalDest.push({
                name:  dest.substring(1),
                destType: dest.startsWith('§') ? 'channel' : dest.startsWith('@') ? 'user' : 'errore',
            })
        }
        return finalDest;
    }

    function createPost(values) {
        let content;
        switch (values.contentType) {
            case "text":
                content = values.testo;
                break
            case "video":
                content = values.video;
                break
            case "image":
                content = values.foto;
                break
        }

        let destinations = parseDestinations(values.destinatari);

        return (
            {
                contentType: values.contentType,
                dateOfCreation: Date.now(),
                creator: "aleuser",
                destinations: destinations,
                content: content
            }
        );
    }
    const onSubmit = async (values) => {
        console.log("form submitted" ,values);

        try {
            let post = createPost(values);

            console.log("post", post);

            let res = await fetch("/db/post", {
                method: "POST",
                body: JSON.stringify({
                    post: post,
                    // inserire quota
                }),
                headers: {
                    "Content-Type": "application/json"
                },
            });

            let response = await res.json();
            console.log("post inviato", response);
        } catch (e) {
            console.log("errore:", e);
        }

    }


    return (
        <main className={" items-start mt-4 flex justify-center m-4"}>
            <Formik
                initialValues={initialValues}
                onSubmit={onSubmit}
                validationSchema={validationSchema}
            >
                {({errors, touched}) => (
                <Form
                    className={"bg-white flex flex-col justify-between rounded-lg w-full font-la"}
                >
                    <div className="flex text-gray-700 justify-center">
                        <h1 className="text-3xl font-latoBold">
                            Crea un nuovo Post!
                        </h1>
                    </div>
                    {/* CONTAINER DEI CAMPI */}
                    <div className="mt-6 w-full mb-4">
                        {/* DESTINATARI */}
                        <div className="flex flex-col justify-between items-start gap-2">
                            <label
                                className={"block font-latoBold text-xl w-full"}
                            >
                                {errors.destinatari && touched.destinatari ? (
                                    <div className={"text-red-600"}>{errors.destinatari}</div>
                                    ) :
                                    <div className={"flex justify-between w-full"}>
                                        <span>Destinatari</span>
                                        <span className={"text-blue-400"}>(@utente, §canale)</span>
                                    </div>
                                }
                            </label>
                            <Field
                                className="border-2 border-gray-500  rounded-md w-full focus:border-teal-500 focus:ring-teal-500 "
                                type="text"
                                placeholder="@Pippo42"
                                name="destinatari"
                            />
                        </div>
                        {/* TIPO DI CONTENUTO DEL POST */}
                        <div className="mt-4 mb-4 flex justify-between items-center">
                            <label
                                className="block font-latoBold text-xl"
                            >
                                Tipologia post
                            </label>
                            <Field
                                as={"select"}
                                id={"contentType"}
                                className="border-2 border-gray-500 rounded-md w-1/3 focus:border-teal-500 focus:ring-teal-500"
                                name="contentType"
                            >
                                <option value="text">Text</option>
                                <option value="image">Image</option>
                                <option value="geolocation">Geolocation</option>
                                <option value="video">Video</option>
                            </Field>
                        </div>

                        {/* CONTENUTO DEL POST */}
                        <div>
                            <Content errors={errors} touched={touched}/>
                        </div>
                    </div>
                        <Button
                            className="flex align-center justify-center gap-2 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
                            type={"submit"}>
                            Submit
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>

                        </Button>
                    </Form>
                    )}
                </Formik>
        </main>
    );

}

const Content = ({errors, touched}) => {
    const {values ,submitForm} = useFormikContext();
    return (
        <div className={"mt-4"}>
            {values.contentType === "text" &&
                <>
                    <label
                        className={"block font-latoBold text-xl"}
                    >
                        {errors.testo && touched.testo ? (
                            <div className={"text-red-600"}>{errors.testo}</div>
                        ) : <span>Contenuto</span>
                        }
                    </label>
                    <Field
                        as={"textarea"}
                        id={"testo"}
                        name={"testo"}

                        rows="4"
                        className="border-2 border-gray-500  rounded-md w-full focus:border-teal-500 focus:ring-teal-500 "
                        placeholder="Raccontaci qualcosa..."
                    >
                    </Field>
                </>
            }
            {values.contentType === "image" &&
                <>
                    <label
                        className={"block font-latoBold text-xl"}
                    >
                        {errors.foto && touched.foto ? (
                            <div className={"text-red-600"}>{errors.foto}</div>
                        ) : <span>Contenuto</span>
                        }
                    </label>
                    <Field
                        name={"foto"}
                        id={"foto"}
                        className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                        type="file"
                    />
                </>
            }
            {values.contentType === "video" &&
                <>
                    <label
                        className={"block font-latoBold text-xl"}
                    >
                        {errors.video && touched.video ? (
                            <div className={"text-red-600"}>{errors.video}</div>
                        ) : <span>Contenuto</span>
                        }
                    </label>
                    <Field
                        name={"video"}
                        id={"video"}
                        placeholder="inserirsci l'url"
                        className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-neutral-300 bg-clip-padding px-3 py-[0.32rem] text-base font-normal text-neutral-700 transition duration-300 ease-in-out file:-mx-3 file:-my-[0.32rem] file:overflow-hidden file:rounded-none file:border-0 file:border-solid file:border-inherit file:bg-neutral-100 file:px-3 file:py-[0.32rem] file:text-neutral-700 file:transition file:duration-150 file:ease-in-out file:[border-inline-end-width:1px] file:[margin-inline-end:0.75rem] hover:file:bg-neutral-200 focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:file:bg-neutral-700 dark:file:text-neutral-100 dark:focus:border-primary"
                        type="url"
                    />
                </>
            }
        </div>
    );
}

export default AddPost;
