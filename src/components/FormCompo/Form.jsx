import { useState } from 'react';
import './Form.css';
import { useUserContext } from '../../Context/StoreContext';

function Form() {

    

    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        gender: '',
        email: '',
        mobileNumber: '',
        password: '',
        conformPassword: ''
    });


    const { refreshUserList } = useUserContext();

    const [validationError, setValidationError] = useState({});

    const validation = () => {

        const newError = {};

        function isAtLeast18(dobString) {
            const dob = new Date(dobString);
            const today = new Date();

            const age = today.getFullYear() - dob.getFullYear();
            const m = today.getMonth() - dob.getMonth();
            const d = today.getDate() - dob.getDate();

            if (m < 0 || (m === 0 && d < 0)) {
                return age - 1 >= 18;
            }

            return age >= 18;
        }


        function convertToISOFormat(dobStr) {
            const parts = dobStr.split(/[-\/]/); // Split by - or /
            return `${parts[2]}-${parts[1]}-${parts[0]}`; // YYYY-MM-DD
        }


        if (!formData.fullName) {
            newError.fullName = "Full Name is required";
        }
        else if (!/^[a-zA-Z]+([ '-][a-zA-Z]+)*$/.test(formData.fullName)) {
            newError.fullName = "Full Name is Invalid";
        }

        if (!formData.dob) {
            newError.dob = "Date of birth is required";
        }
        else if (!/^(0[1-9]|[12][0-9]|3[01])[-\/](0[1-9]|1[0-2])[-\/](19|20)\d{2}$/.test(formData.dob)) {
            newError.dob = "Dob must be in valid formate like DD-MM-YYYY or DD/MM/YYYY";
        }
        else if (!isAtLeast18(convertToISOFormat(formData.dob))) {
            newError.dob = "Age is Less Than 18";
        }

        if (!formData.email) {
            newError.email = "Email is required";
        }
        else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email)) {
            newError.email = "Email must contain @ symbol";
        }

        if (!formData.mobileNumber) {
            newError.mobileNumber = "Mobile Number is required";
        }
        else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
            newError.mobileNumber = "Invalid Mobile Number";
        }

        if (!formData.password) {
            newError.password = "Password is required";
        }
        else if (formData.password.length < 8) {
            newError.password = "Password must be of minimum 8 charactes";
        }
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/.test(formData.password)) {
            newError.password = "Use 1 uppercase, 1 lowercase, 1 number & 1 special character.";
        }

        if (!formData.conformPassword) {
            newError.conformPassword = "conform password is required";
        }
        else if (formData.conformPassword != formData.password) {
            newError.conformPassword = "conform password must match password";
        }

        if (!formData.gender) {
            newError.gender = "Please Select Gender";
        }
        else if (formData.gender != "Male" && formData.gender != "Female") {
            newError.gender = "Invalid Gender";
        }


        setValidationError(newError);
        return Object.keys(newError).length === 0;
    }


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setValidationError({ ...validationError, [e.target.name]: '' });
    }


    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const handleFileChange = (e) => {

        const file = e.target.files[0];

        console.log("File",file);
        const reader = new FileReader();
        reader.onloadend = () => setPreview(reader.result);
        reader.readAsDataURL(file);

        setFile(file); 
    };

    const [isLoading, setIsLoading] = useState(false);

    const [backendError, setBackendError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validation() && file) {
            console.log("hello");
            setIsLoading(true);

            try {
                const formDataToSend = new FormData();

                Object.keys(formData).forEach(key => {
                    formDataToSend.append(key, formData[key]);
                });

                formDataToSend.append("image", file);

                const response = await fetch("http://localhost:4000/api/submit", {
                    method: "POST",
                    body: formDataToSend
                });

                const result = await response.json();

                console.log(result);

                if (response.ok) {
                    console.log("Form submitted successfully:", result);
                    setTimeout(() => {
                        refreshUserList();
                    }, 2000);
                } else {
                    if (result.status.code == 409) {
                        setBackendError(result.status.message);
                    }
                    else if(result.status.message==="Only image files are allowed")
                    {
                        setBackendError("Only JPG and PNG images are allowed.");
                    }
                    console.error("Form submission error:", result);
                }
            }
            catch (error) {
                console.error("Error:", error);
            }
            finally {
                setIsLoading(false);
            }
        }
    };



    return <div className='form-main'>

        <div className='form-head-container'>
            <div className='Image-header'>
                <p>Enter Your Details</p>
                {preview == null ? <div className='upload-image'>Upload Image</div> : <img src={preview} alt='this is an preview image'></img>}
            </div>


            <form className='form-container' onSubmit={handleSubmit}>

                <div className='multiple-input'>
                    <div>
                        <input type="text" placeholder='FullName' name='fullName' value={formData.fullName} onChange={handleChange} />
                        {validationError.fullName && <p id="error">{validationError.fullName}</p>}
                    </div>

                    <div>
                        <input type="text" placeholder='DOB' name='dob' value={formData.dob} onChange={handleChange} />
                        {validationError.dob && <p id="error">{validationError.dob}</p>}
                    </div>

                </div>



                <div className='multiple-input'>
                    <div>
                        <input type="text" placeholder='Email' name='email' value={formData.email} onChange={handleChange} />
                        {validationError.email && <p id="error">{validationError.email}</p>}
                    </div>

                    <div>
                        <input type="text" placeholder='MobileNumber' name='mobileNumber' value={formData.mobileNumber} onChange={handleChange} />
                        {validationError.mobileNumber && <p id="error">{validationError.mobileNumber}</p>}
                    </div>

                </div>

                <div className='multiple-input'>
                    <div>
                        <input type="text" placeholder='Password' name='password' value={formData.password} onChange={handleChange} />
                        {validationError.password && <p id="error">{validationError.password}</p>}
                    </div>


                    <div>
                        <input type="text" placeholder='Confirm Password' name='conformPassword' value={formData.conformPasswordconformPassword} onChange={handleChange} />
                        {validationError.conformPassword && <p id="error">{validationError.conformPassword}</p>}
                    </div>
                </div>



                <div className='multiple-input'>
                    <div className='gender-selection'>
                        <div className='gender-selection-sub-div'>
                            <div className='radio-container'>
                                <input type="radio" value="Male" id='genderMale' name='gender' onChange={handleChange} />
                                <label htmlFor='genderMale'>Male</label>
                            </div>
                            <div className='radio-container'>
                                <input type="radio" value="Female" id='genderFemale' name='gender' onChange={handleChange} />
                                <label htmlFor='genderFemale'>Female</label>
                            </div>
                        </div>
                        {validationError.gender && <p id="error">{validationError.gender}</p>}
                    </div>

                    <input id="choose-file" type="file" accept='image/jpeg,image/png' onChange={handleFileChange} />
                </div>


                {backendError != "" ? <div className='backend-error'>{backendError}</div> : ""}
                <button type="submit">
                    {isLoading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>

    </div>;




}

export default Form;