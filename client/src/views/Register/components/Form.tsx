import { useState } from "react";
import { toast } from "react-toastify";
import Button from "../../../components/Button";
import { $post } from "../../../utils/fetch";
import useInput from "../../../utils/hooks/useInput";

const Form = () => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({ phone: "", password: "" });

    const { value: phone, bind: bindPhone } = useInput("");
    const { value: password, bind: bindPassword } = useInput("");

    const validation = () => {
        let isValid = true;
        let phoneError = "";
        let passwordError = "";

        if (phone.length < 10) {
            phoneError = "Enter a valid phone number!";
            isValid = false;
        } else {
            phoneError = "";
        }

        if (password.length < 8) {
            passwordError = "Password should be at lease 8 characters!";
            isValid = false;
        } else {
            passwordError = "";
        }
    
        setErrors({
            phone: phoneError,
            password: passwordError,
        });

        return isValid;
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!validation()) {
            return;
        }

        setLoading(true);

        const data = { phone, password };

        $post("auth/register", data).then((res: any) => {
            if (res.data.status === "success") {
                const { token } = res.data.data;

                // save token in storage
                window.localStorage["token"] = token;

                toast.success(`Your account has been created, welcome to the bezo family!`);
            }

            if (res.data.status === "error") {
                const errors = res.data.data;
                const errorKeys = Object.keys(errors);

                errorKeys.forEach((key) => {
                    toast.error(errors[key]);
                });
            }

            setLoading(false);
        }).catch((err) => {
            console.log(err);
            toast.error("An error occured, our team has been notified!");

            setLoading(false);
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="register-page__form"
        >
            <h2 className="register-page__form__title">Register an account.</h2>
            <div className="form-group flex-col mt:_3">
                <label>Phone</label>
                <input
                    type="text"
                    className="form-input"
                    name="phone"
                    placeholder="0560265879"
                    {...bindPhone}
                />
                <small className="form-errors">{errors.phone}</small>
            </div>
            <div className="form-group flex-col mt:_2">
                <label>Password</label>
                <input
                    type="text"
                    className="form-input"
                    name="password"
                    placeholder="*******"
                    {...bindPassword}
                />
                <small className="form-errors">{errors.password}</small>
            </div>
            <div className="form-group mt:_2">
                <Button
                    loading={loading}
                    disabled={(phone.length === 0 || password.length === 0)}
                >
                    Register
                </Button>
            </div>
        </form>
    );
};

export default Form;
