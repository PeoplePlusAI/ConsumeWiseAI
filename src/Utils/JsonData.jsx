import Icons from './Icons';
import { useDispatch } from 'ResuableFunctions/CustomHooks';
import ShortUniqueId from 'short-unique-id';
import store from 'StoreIndex';
import { useSelector } from 'react-redux';
import { handleInterviewRegistrationOnChange } from 'Views/InterviewCandidates/Action/interviewAction';

const readFile = (file) => {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.onloadend = () => {
            resolve({
                id: new ShortUniqueId({ length: 10 }),
                filename: file.name,
                filetype: file.type,
                fileimage: reader.result,
                datetime: file.lastModifiedDate.toLocaleString("en-IN"),
                filesize: filesizes(file.size),
            });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

function formatDateForInput(date) {
    if (!date) return ""; // Return empty if date is null
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const filesizes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const JsonData = () => {
    //main selectors
    const dispatch = useDispatch();
    // const state = store.getState();
    const { interviewState, commonState } = useSelector((state) => state);

    const jsonOnly = {
        adminSidebarMenus: [
            {
                icon: Icons.dashboardIcon,
                name: "Dashboard",
                route: "/dashboard/home"
            },
            {
                icon: Icons?.employeeIcon,
                name: "Employees",
                route: "/dashboard/employees"
            },
            {
                icon: Icons.attendanceIcon,
                name: "Attendance",
                route: "/dashboard/attendance"
            },
            {
                icon: Icons.payrollIcon,
                name: "Payroll",
                route: "/dashboard/payroll"
            },
            {
                icon: Icons.interviewIcon,
                name: "Interview",
                route: "/dashboard/interview"
            },
            {
                icon: Icons.circularIcon,
                name: "Circular",
                route: "/dashboard/circular"
            },
            {
                icon: Icons.invoicesIcon,
                name: "Invoices",
                route: "/dashboard/invoices"
            },
            {
                icon: Icons.notesIcon,
                name: "Notes",
                route: "/dashboard/notes"
            },
            {
                icon: Icons.doocumentIcon,
                name: "Documents",
                route: "/dashboard/documents"
            }
        ],
        states: [
            { value: 1, label: 'Andaman and Nicobar Islands' },
            { value: 2, label: 'Andhra Pradesh' },
            { value: 3, label: 'Arunachal Pradesh' },
            { value: 4, label: 'Assam' },
            { value: 5, label: 'Bihar' },
            { value: 6, label: 'Chandigarh' },
            { value: 7, label: 'Chhattisgarh' },
            { value: 8, label: 'Dadra and Nagar Haveli' },
            { value: 9, label: 'Delhi' },
            { value: 10, label: 'Goa' },
            { value: 11, label: 'Gujarat' },
            { value: 12, label: 'Haryana' },
            { value: 13, label: 'Himachal Pradesh' },
            { value: 14, label: 'Jammu and Kashmir' },
            { value: 15, label: 'Jharkhand' },
            { value: 16, label: 'Karnataka' },
            { value: 17, label: 'Kerala' },
            { value: 18, label: 'Madhya Pradesh' },
            { value: 19, label: 'Maharashtra' },
            { value: 20, label: 'Manipur' },
            { value: 21, label: 'Meghalaya' },
            { value: 22, label: 'Mizoram' },
            { value: 23, label: 'Nagaland' },
            { value: 24, label: 'Odisha' },
            { value: 25, label: 'Puducherry' },
            { value: 26, label: 'Punjab' },
            { value: 27, label: 'Rajasthan' },
            { value: 28, label: 'Tamil Nadu' },
            { value: 29, label: 'Telangana' },
            { value: 30, label: 'Tripura' },
            { value: 31, label: 'Uttar Pradesh' },
            { value: 32, label: 'Uttarakhand' },
            { value: 33, label: 'West Bengal' }
        ],
        gender: [
            "Male",
            "Female"
        ],
        maritalStatus: [
            "Married",
            "Un Married"
        ],
        canditateRole: [
            "Front-End-Developer",
            "MERN-Stack-Developer"
        ],
        yearOfExp: [
            "0 to 6 Months",
            "6 Months & Above"
        ],
        interviewRound: [
            "HR Round",
            "Apptitude Round",
            "Technical Round",
            "Machine Test",
            "Face to Face Interview",
        ]

    }

    const jsxJson = {
        //                                                              candidate registration form                                                                  //
        candidateRegistration: [
            //                                                                       Candidate details                                                               //
            {
                category: "heading",
                title: "Candidate details",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: "Full Name",
                type: "text",
                category: "input",
                placeholder: "",
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                value: interviewState?.candidateData?.name || '',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ name: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.name ? "Full Name required" : null
            },
            {
                name: "Age",
                type: "text",
                category: "input",
                placeholder: "",
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                value: interviewState?.candidateData?.age || '',
                change: (e) => {
                    if (/^\d*$/.test(e.target.value)) {
                        console.log("/^\d*$/.test(e.target.value)")
                        dispatch(handleInterviewRegistrationOnChange({ age: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.age ? "Age required" : null
            },
            {
                name: "Phone Number",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.phoneNumber || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => {
                    if (/^\d*$/.test(e.target.value)) {
                        dispatch(handleInterviewRegistrationOnChange({ phoneNumber: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.phoneNumber ? "Phone number required" : null
            },
            {
                name: "Email",
                type: "email",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.email || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ email: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.email ? "Email required" : null
            },
            {
                name: "Gender",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: interviewState?.candidateData?.gender || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                options: jsonOnly.gender,
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ gender: e.target.value })),
                Err: commonState?.validated && !interviewState?.candidateData?.gender ? "Gender required" : null,
                isMandatory: true
            },
            {
                name: "Address",
                type: "textbox",
                category: "textbox",
                placeholder: "",
                value: interviewState?.candidateData?.address || '',
                divClassName: 'col-12 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ address: e.target.value })),
                Err: commonState?.validated && !interviewState?.candidateData?.address ? "Address required" : null,
                isMandatory: true
            },

            //                                                                      Family details                                                                 //
            {
                category: "heading",
                title: "Family details",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: `Parent ${interviewState?.candidateData?.gender === "Female" ? "/ Husband " : ""} name`,
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.parentName || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ parentName: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.parentName ? "Parent / Husband name required" : null
            },
            {
                name: `Parent ${interviewState?.candidateData?.gender === "Female" ? "/ Husband " : ""} occupation`,
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.parentOccupation || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ parentOccupation: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.parentOccupation ? "Parent / Husband occupation required" : null
            },
            {
                name: "Marital status",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: interviewState?.candidateData?.maritalStatus || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                options: jsonOnly?.maritalStatus,
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ maritalStatus: e.target.value })),
                Err: commonState?.validated && !interviewState?.candidateData?.maritalStatus ? "Marital status required" : null,
                isMandatory: true
            },
            {
                name: "Childrens",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.childrens || '',
                divClassName: `col-12 col-md-6 col-lg-4 p-1 mt-2 ${interviewState?.candidateData?.maritalStatus ? interviewState?.candidateData?.maritalStatus === "Married" ? "" : "d-none" : "d-none"}`,
                change: (e) => {
                    // if (/^\d*$/.test(e.target.value)) {
                    dispatch(handleInterviewRegistrationOnChange({ childrens: e.target.value }))
                    // }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.childrens ? "Childrens required" : null
            },
            {
                name: "Brother / Sister name",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.siblings || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ siblings: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.name ? "Brother / Sister name required" : null
            },
            {
                name: "Address (Cbe if Any)",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.addressIfAnyCbe || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ addressIfAnyCbe: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.addressIfAnyCbe ? "Address (Cbe if Any) required" : null
            },

            //                                                                Academics & Education                                                                //
            {
                category: "heading",
                title: "Academics & Education",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: "School Name (SSLC)",
                sub_heading: "school/college",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.sslcSchoolName || '',
                divClassName: 'col-6 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ sslcSchoolName: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.name ? "School Name required" : null
            },
            {
                name: "Marks/Percentage",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.sslcMarks || '',
                divClassName: 'col-6 p-1 mt-2',
                change: (e) => {
                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                        dispatch(handleInterviewRegistrationOnChange({ sslcMarks: e.target.value }));
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.sslcMarks ? "Marks/Percentage required" : null
            },
            {
                name: "School Name (HSC)",
                sub_heading: "school/college",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.hscSchoolName || '',
                divClassName: 'col-6 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ hscSchoolName: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.hscSchoolName ? "School Name required" : null
            },
            {
                name: "Marks/Percentage",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.hscMarks || '',
                divClassName: 'col-6 p-1 mt-2',
                change: (e) => {
                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                        dispatch(handleInterviewRegistrationOnChange({ hscMarks: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.hscMarks ? "Marks/Percentage required" : null
            },
            {
                name: "College",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.collegeName || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ collegeName: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.collegeName ? "College Name required" : null
            },
            {
                name: "Qualification",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.candidateQualification || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ candidateQualification: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.candidateQualification ? "Qualification required" : null
            },
            {
                name: "CGPA/Percentage",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.collegeMarks || '',
                divClassName: 'col-12 col-md-6 col-lg-4 p-1 mt-2',
                change: (e) => {
                    if (/^\d*\.?\d*$/.test(e.target.value)) {
                        dispatch(handleInterviewRegistrationOnChange({ collegeMarks: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.collegeMarks ? "Marks/Percentage required" : null
            },

            //                                                                Fresher or Experienced                                                              //
            {
                category: "heading",
                title: "Fresher / Experience",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: "Fresher",
                type: "radio",
                category: "Checkbox",
                placeholder: "",
                value: "fresher",
                divClassName: 'col-6 col-md-4 col-lg-2 col-xl-1 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ experience: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.experience ? "Experience type required" : null
            },
            {
                name: "Experienced",
                type: "radio",
                category: "Checkbox",
                placeholder: "",
                value: "experienced",
                divClassName: 'col-6 col-md-4 col-lg-2 col-xl-1 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ experience: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.experience ? "Experience type required" : null
            },


            //                                                                       Role                                                                         //
            {
                category: "heading",
                title: "Role",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: interviewState?.candidateData?.canditateRole || '',
                options: jsonOnly?.canditateRole,
                divClassName: 'col-12 col-md-8 col-lg-4 col-xl-3 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ canditateRole: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.canditateRole ? "Experience type required" : null
            },

            //                                                                  Work Experience                                                                   //
            {
                category: "heading",
                title: "Work Experience",
                divClassName: `col-12 p-1 mt-2 ${interviewState?.candidateData?.experience !== "experienced" ? "d-none" : ""}`,
            },
            {
                name: "Organization name",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.previousCompanyName || '',
                divClassName: `col-12 col-md-8 col-lg-4 p-1 mt-2 ${interviewState?.candidateData?.experience !== "experienced" ? "d-none" : ""}`,
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ previousCompanyName: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.previousCompanyName ? "Organization name required" : null
            },
            {
                name: "Desigination",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.designation || '',
                divClassName: `col-12 col-md-8 col-lg-4 p-1 mt-2 ${interviewState?.candidateData?.experience !== "experienced" ? "d-none" : ""}`,
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ designation: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.designation ? "Organization name required" : null
            },
            {
                name: "Years of Experience",
                type: "normal_select",
                category: "select",
                placeholder: "",
                value: interviewState?.candidateData?.canditateExpType || '',
                options: jsonOnly?.yearOfExp,
                divClassName: `col-12 col-md-8 col-lg-4 p-1 mt-2 ${interviewState?.candidateData?.experience !== "experienced" ? "d-none" : ""}`,
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ canditateExpType: e.target.value })),
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.canditateExpType ? "Years of Experience required" : null
            },


            //                                                             Expected Salary (if any)                                                              //
            {
                category: "heading",
                title: "Expected Salary (if any)",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: "Present Salary if applicable",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.currentSalary || '',
                divClassName: 'col-12 col-md-8 col-lg-4 p-1 mt-2',
                change: (e) => {
                    if (/^\d*$/.test(e.target.value)) {
                        dispatch(handleInterviewRegistrationOnChange({ currentSalary: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.currentSalary ? "Present Salary required" : null
            },
            {
                name: "Expected Salary",
                type: "text",
                category: "input",
                placeholder: "",
                value: interviewState?.candidateData?.expectedSalary || '',
                divClassName: 'col-12 col-md-8 col-lg-4 p-1 mt-2',
                change: (e) => {
                    if (/^\d*$/.test(e.target.value)) {
                        dispatch(handleInterviewRegistrationOnChange({ expectedSalary: e.target.value }))
                    }
                },
                isMandatory: true,
                Err: commonState?.validated && !interviewState?.candidateData?.expectedSalary ? "Expected Salary required" : null
            },

            //                                                                      Remarks                                                                      //
            {
                category: "heading",
                title: "Remarks and Questions if any",
                divClassName: 'col-12 p-1 mt-2',
            },
            {
                name: "Write here",
                type: "textbox",
                category: "textbox",
                placeholder: "",
                value: interviewState?.candidateData?.remarks || '',
                divClassName: 'col-12 p-1 mt-2',
                change: (e) => dispatch(handleInterviewRegistrationOnChange({ remarks: e.target.value })),
                isMandatory: false
            },
        ],

        //                                                              load                                                                  //
        // loadAddEditInputs: [
        //     {
        //         name: "Company Name",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_load_card?.company_name || '',
        //         change: (e) => dispatch(handleLoadInputOnChange({ company_name: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_load_card?.company_name ? "Company name required" : ''
        //     },
        //     {
        //         name: "Contact Number",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_load_card?.contact_no || '',
        //         change: (e) => {
        //             if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) {
        //                 dispatch(handleLoadInputOnChange({ contact_no: e.target.value }))
        //             }
        //         },
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_load_card?.contact_no ? "Contact number required" : ''
        //     },
        //     {
        //         name: "From",
        //         type: "text",
        //         category: "googleLocation",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_load_card?.from_location || '',
        //         change: (e) => dispatch(handleLoadInputOnChange({ from_location: e.target.value })),
        //         placedSelectedClick: (slectedLoc) => dispatch(handleLoadInputOnChange({ from_location: slectedLoc })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_load_card?.from_location ? "From location required" : ''
        //     },
        //     {
        //         name: "To",
        //         type: "text",
        //         category: "googleLocation",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_load_card?.to_location || '',
        //         change: (e) => dispatch(handleLoadInputOnChange({ to_location: e.target.value })),
        //         placedSelectedClick: (slectedLoc) => dispatch(handleLoadInputOnChange({ to_location: slectedLoc })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_load_card?.to_location ? "To location required" : ''
        //     },
        //     {
        //         name: "Material",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_load_card?.material || '',
        //         change: (e) => dispatch(handleLoadInputOnChange({ material: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_load_card?.material ? "Material required" : ''
        //     },
        //     {
        //         name: "Ton",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_load_card?.tone || '',
        //         change: (e) => {
        //             if (/^\d*$/.test(e.target.value)) {
        //                 dispatch(handleLoadInputOnChange({ tone: e.target.value }))
        //             }
        //         },
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_load_card?.tone ? "Tone required" : ''
        //     },
        //     {
        //         name: "Truck Body Type",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_load_card?.truck_body_type || '',
        //         options: jsonOnly.truckBodyType,
        //         change: (e) => dispatch(handleLoadInputOnChange({ truck_body_type: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_load_card?.truck_body_type ? "Truck body type required" : ''
        //     },
        //     {
        //         name: "No Of Tyres",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_load_card?.no_of_tyres || '',
        //         options: jsonOnly.noOfTyres,
        //         change: (e) => dispatch(handleLoadInputOnChange({ no_of_tyres: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_load_card?.no_of_tyres ? "No of tyres required" : ''
        //     },
        //     {
        //         name: "Description",
        //         type: "textbox",
        //         category: "textbox",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_load_card?.description || '',
        //         change: (e) => dispatch(handleLoadInputOnChange({ description: e.target.value })),
        //         isMandatory: false,
        //         // Err: commonState?.validated && !state?.servicesState?.new_edit_load_card?.description ? "Description required" : ''
        //     }
        // ],

        //                                                              truck                                                                  //
        // truckAddEditInputs: [
        //     {
        //         name: "Vehicle Number",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_truck_card?.vehicle_number || [],
        //         options: state?.servicesState?.user_vehicle_list,
        //         change: (value) => dispatch(handleTruckInputOnChange({ vehicle_number: value, vehicle_number_selected: value[0]?.label })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_truck_card?.vehicle_number?.length ? "Vehicle number required" : ''
        //     },
        //     {
        //         name: "Company Name",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_truck_card?.company_name || '',
        //         change: (e) => dispatch(handleTruckInputOnChange({ company_name: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_truck_card?.company_name ? "Company name required" : ''
        //     },
        //     {
        //         name: "Contact Number",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_truck_card?.contact_no || '',
        //         change: (e) => {
        //             if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) {
        //                 dispatch(handleTruckInputOnChange({ contact_no: e.target.value }))
        //             }
        //         },
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_truck_card?.contact_no ? "Contact number required" : ''
        //     },
        //     {
        //         name: "Name of the transport",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_truck_card?.name_of_the_transport || '',
        //         change: (e) => dispatch(handleTruckInputOnChange({ name_of_the_transport: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_truck_card?.name_of_the_transport ? "Name of the transport required" : ''
        //     },
        //     {
        //         name: "Ton",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_truck_card?.tone || '',
        //         change: (e) => {
        //             if (/^\d*$/.test(e.target.value)) {
        //                 dispatch(handleTruckInputOnChange({ tone: e.target.value }))
        //             }
        //         },
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_truck_card?.tone ? "Ton required" : ''
        //     },
        //     {
        //         name: "Brand Name",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_truck_card?.truck_brand_name || '',
        //         options: jsonOnly.truckBrand,
        //         change: (e) => dispatch(handleTruckInputOnChange({ truck_brand_name: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_truck_card?.truck_brand_name ? "Truck brand name required" : ''
        //     },
        //     {
        //         name: "From",
        //         type: "text",
        //         category: "googleLocation",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_truck_card?.from_location || '',
        //         change: (e) => dispatch(handleTruckInputOnChange({ from_location: e.target.value })),
        //         placedSelectedClick: (slectedLoc) => dispatch(handleTruckInputOnChange({ from_location: slectedLoc })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_truck_card?.from_location ? "From location required" : ''
        //     },
        //     {
        //         name: "To",
        //         type: "text",
        //         category: "googleLocation",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_truck_card?.to_location || [],
        //         change: (e) => dispatch(handleTruckInputOnChange({ to_location: e.target.value })),
        //         placedSelectedClick: (slectedLoc) => dispatch(handleTruckInputOnChange({ to_location: slectedLoc })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_truck_card?.to_location ? "To location required" : ''
        //     },
        //     {
        //         name: "Truck Body Type",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_truck_card?.truck_body_type || '',
        //         options: jsonOnly.truckBodyType,
        //         change: (e) => dispatch(handleTruckInputOnChange({ truck_body_type: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_truck_card?.truck_body_type ? "Truck body type required" : ''
        //     },
        //     {
        //         name: "Truck Size",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_truck_card?.truck_size || '',
        //         change: (e) => {
        //             if (/^\d*$/.test(e.target.value)) {
        //                 dispatch(handleTruckInputOnChange({ truck_size: e.target.value }))
        //             }
        //         },
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_truck_card?.truck_size ? "Truck size required" : ''
        //     },
        //     {
        //         name: "No Of Tyres",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_truck_card?.no_of_tyres || '',
        //         options: jsonOnly.noOfTyres,
        //         change: (e) => dispatch(handleTruckInputOnChange({ no_of_tyres: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_truck_card?.no_of_tyres ? "No of tyres required" : ''
        //     },
        //     {
        //         name: "Description",
        //         type: "textbox",
        //         category: "textbox",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_truck_card?.description || '',
        //         change: (e) => dispatch(handleTruckInputOnChange({ description: e.target.value })),
        //         isMandatory: false,
        //         // Err:commonState?.validated && !state?.servicesState?.new_edit_truck_card?.description ? "Description required" : ''
        //     }
        // ],

        //                                                               driver                                                                //
        // driverAddEditInputs: [
        //     {
        //         name: "Vehicle Number",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_driver_card?.vehicle_number || [],
        //         options: state?.servicesState?.user_vehicle_list,
        //         change: (value) => dispatch(handleDriverInputOnChange({ vehicle_number: value, vehicle_number_selected: value[0]?.label })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_driver_card?.vehicle_number?.length ? "Vehicle number required" : ''
        //     },
        //     {
        //         name: "Company Name",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_driver_card?.company_name || '',
        //         change: (e) => dispatch(handleDriverInputOnChange({ company_name: e.target.value })),
        //         isMandatory: true
        //     },
        //     {
        //         name: "Driver Name",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_driver_card?.driver_name || '',
        //         change: (e) => dispatch(handleDriverInputOnChange({ driver_name: e.target.value })),
        //         isMandatory: true
        //     },
        //     {
        //         name: "Contact Number",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_driver_card?.contact_no || '',
        //         change: (e) => {
        //             if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) {
        //                 dispatch(handleDriverInputOnChange({ contact_no: e.target.value }))
        //             }
        //         },
        //         isMandatory: true
        //     },
        //     {
        //         name: "From",
        //         type: "text",
        //         category: "googleLocation",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_driver_card?.from_location || '',
        //         change: (e) => dispatch(handleDriverInputOnChange({ from_location: e.target.value })),
        //         placedSelectedClick: (slectedLoc) => dispatch(handleDriverInputOnChange({ from_location: slectedLoc })),
        //         isMandatory: true
        //     },
        //     {
        //         name: "To",
        //         type: "text",
        //         category: "googleLocation",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_driver_card?.to_location || '',
        //         change: (e) => dispatch(handleDriverInputOnChange({ to_location: e.target.value })),
        //         placedSelectedClick: (slectedLoc) => dispatch(handleDriverInputOnChange({ to_location: slectedLoc })),
        //         isMandatory: true
        //     },

        //     {
        //         name: "Truck Body Type",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_driver_card?.truck_body_type || '',
        //         options: jsonOnly.truckBodyType,
        //         change: (e) => dispatch(handleDriverInputOnChange({ truck_body_type: e.target.value })),
        //         isMandatory: true
        //     },
        //     {
        //         name: "No Of Tyres",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_driver_card?.no_of_tyres || '',
        //         options: jsonOnly.noOfTyres,
        //         change: (e) => dispatch(handleDriverInputOnChange({ no_of_tyres: e.target.value })),
        //         isMandatory: true
        //     },
        //     {
        //         name: "Description",
        //         type: "textbox",
        //         category: "textbox",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_driver_card?.description || '',
        //         change: (e) => dispatch(handleDriverInputOnChange({ description: e.target.value })),
        //         isMandatory: false
        //     }
        // ],

        //                                                             buy and sell                                                            //
        // buyAndSellAddEdit: [
        //     {
        //         name: "Model Year",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         options: modelYears(),
        //         value: state?.servicesState?.new_edit_buyAndsell_card?.model || '',
        //         change: (e) => dispatch(handleBuyAndSellInputOnChange({ model: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_buyAndsell_card?.model ? "Model required" : ''
        //     },
        //     {
        //         name: "Brand Name",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_buyAndsell_card?.brand || '',
        //         options: jsonOnly.truckBrand,
        //         change: (e) => dispatch(handleBuyAndSellInputOnChange({ brand: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_buyAndsell_card?.brand ? "Brand required" : ''
        //     },
        //     {
        //         name: "Owner Name",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_buyAndsell_card?.owner_name || '',
        //         change: (e) => dispatch(handleBuyAndSellInputOnChange({ owner_name: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_buyAndsell_card?.owner_name ? "Owner name required" : ''
        //     },
        //     {
        //         name: "Vehicle Number",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_buyAndsell_card?.vehicle_number || [],
        //         options: state?.servicesState?.user_vehicle_list,
        //         change: (value) => dispatch(handleBuyAndSellInputOnChange({ vehicle_number: value, vehicle_number_selected: value[0]?.label })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_buyAndsell_card?.vehicle_number?.length ? "Vehicle number required" : ''
        //     },
        //     {
        //         name: "Kilometers driven",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_buyAndsell_card?.kms_driven || '',
        //         change: (e) => {
        //             if (/^\d*$/.test(e.target.value)) {
        //                 dispatch(handleBuyAndSellInputOnChange({ kms_driven: e.target.value }))
        //             }
        //         },
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_buyAndsell_card?.kms_driven ? "Kilometers required" : ''
        //     },
        //     {
        //         name: "Price",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_buyAndsell_card?.price || '',
        //         change: (e) => {
        //             if (/^\d*$/.test(e.target.value)) {
        //                 dispatch(handleBuyAndSellInputOnChange({ price: e.target.value }))
        //             }
        //         },
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_buyAndsell_card?.price ? "Price required" : ''
        //     },
        //     {
        //         name: "Tonnage",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_buyAndsell_card?.tonnage || '',
        //         change: (e) => {
        //             if (/^\d*$/.test(e.target.value)) {
        //                 dispatch(handleBuyAndSellInputOnChange({ tonnage: e.target.value }))
        //             }
        //         },
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_buyAndsell_card?.tonnage ? "Tonnage required" : ''
        //     },
        //     {
        //         name: "Location",
        //         type: "text",
        //         category: "googleLocation",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_buyAndsell_card?.location || '',
        //         change: (e) => dispatch(handleBuyAndSellInputOnChange({ location: e.target.value })),
        //         placedSelectedClick: (slectedLoc) => dispatch(handleBuyAndSellInputOnChange({ location: slectedLoc })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_buyAndsell_card?.location ? "Location required" : ''
        //     },
        //     {
        //         name: "Contact Number",
        //         type: "text",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_buyAndsell_card?.contact_no || '',
        //         change: (e) => {
        //             if (/^\d*$/.test(e.target.value) && e.target.value.length <= 10) {
        //                 dispatch(handleBuyAndSellInputOnChange({ contact_no: e.target.value }))
        //             }
        //         },
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_buyAndsell_card?.contact_no ? "Contact Number required" : ''
        //     },

        //     {
        //         name: "Truck Body Type",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_buyAndsell_card?.truck_body_type || '',
        //         options: jsonOnly.truckBodyType,
        //         change: (e) => dispatch(handleBuyAndSellInputOnChange({ truck_body_type: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_buyAndsell_card?.truck_body_type ? "Truck Body Type required" : ''
        //     },
        //     {
        //         name: "No Of Tyres",
        //         type: "select",
        //         category: "select",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_buyAndsell_card?.no_of_tyres || '',
        //         options: jsonOnly.noOfTyres,
        //         change: (e) => dispatch(handleBuyAndSellInputOnChange({ no_of_tyres: e.target.value })),
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_buyAndsell_card?.no_of_tyres ? "No Of Tyres required" : ''
        //     },
        //     {
        //         name: "Upload image",
        //         type: "file",
        //         category: "input",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_buyAndsell_card?.blog_image_show_ui || [],
        //         change: (e) => {
        //             // -- For Multiple File Input
        //             let myImages = state?.servicesState?.new_edit_buyAndsell_card?.blog_image_show_ui;
        //             let makeImagesList = [];

        //             // Use `Promise.all` to handle async file reading
        //             Promise.all(
        //                 Array.from(e.target.files).map((file) => readFile(file))
        //             )
        //                 .then((results) => {
        //                     makeImagesList = results;
        //                     if (myImages) {
        //                         makeImagesList = [...myImages, ...makeImagesList];
        //                     }

        //                     dispatch(handleBuyAndSellInputOnChange({ blog_image_show_ui: makeImagesList, blog_image_send_api: e.target.files }));
        //                 })
        //                 .catch((error) => console.error('Error reading files:', error));
        //         },
        //         isMandatory: true,
        //         Err: commonState?.validated && !state?.servicesState?.new_edit_buyAndsell_card?.blog_image_show_ui?.length ? "Image required" : ''
        //     },
        //     {
        //         name: "Description",
        //         type: "textbox",
        //         category: "textbox",
        //         placeholder: "",
        //         value: state?.servicesState?.new_edit_buyAndsell_card?.description || '',
        //         change: (e) => dispatch(handleBuyAndSellInputOnChange({ description: e.target.value })),
        //         isMandatory: false
        //     }
        // ],
    }

    return {
        "jsonOnly": jsonOnly,
        "jsxJson": jsxJson
    }
}

export default JsonData