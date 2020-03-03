import React, { useState, Fragment } from "react";
import moment from "moment";
import "./App.css";
import { COURSE_LIST, SUBJECT_LIST } from "./constants";
import SubjectList from "./SubjectList";

function App() {
  const defaultErrorObject = { isError: false, message: "" };

  const [errorObject, setErrorObject] = useState(defaultErrorObject);

  const [selectedCourse, setCourse] = useState("");

  const [selectedSubjects, setSubject] = useState([]);

  const [date, setDate] = useState("");

  const [additionalNotes, setAdditionalNotes] = useState("");

  const [isLoading, setSubmitLoader] = useState(false);

  const [isSuccess, setSuccess] = useState(false);

  const onSubjectSelect = subjectId => {
    if (!selectedSubjects.includes(subjectId)) {
      setSubject([...selectedSubjects, subjectId]);
    } else {
      setSubject(selectedSubjects.filter(item => item !== subjectId));
    }
  };

  const getExamDatesUnix = dates => {
    const dateFormat = "DD MMMM, YYYY";
    let unixDates = [];
    dates.map(data => {
      let unix = moment(data, dateFormat).unix();
      unixDates.push(unix);
    });
    return unixDates;
  };

  const handleDateValidation = value => {
    const timeStamp = moment(value, "YYYY-MM-DD").unix();
    const examDates = getExamDatesUnix([
      "20 December, 2019",
      "15 January, 2020",
      "1 February, 2020"
    ]);
    let isValid = false;
    for (let i = 0; i <= examDates.length - 1; i++) {
      if (examDates[i] === timeStamp) {
        isValid = true;
      }
    }
    return isValid;
  };

  const handleSubmit = () => {
    setSubmitLoader(true);
    const isValidDate = handleDateValidation(date);
    if (!selectedCourse || !selectedSubjects.length) {
      setErrorObject({
        isError: true,
        message: "Subject and Course are mandatory."
      });
    } else if (date && !isValidDate) {
      setErrorObject({
        isError: true,
        message:
          "Your selected course and subject is not offered beginning from your selected date"
      });
    } else if (!date) {
      setErrorObject({
        isError: true,
        message: "Please select the date"
      });
    } else if (additionalNotes.length < 20) {
      setErrorObject({
        isError: true,
        message: "Additional notes should have minimum 20 characters"
      });
    } else {
      setErrorObject({
        isError: false,
        message: ""
      });
      setTimeout(() => {
        setSubmitLoader(false);
        setSuccess(true);
      }, 3000);
      return false;
    }
    setTimeout(() => {
      setSubmitLoader(false);
    }, 1000);
  };

  const handleCourseChange = value => {
    setCourse(value);
  };

  const handleDateChange = value => {
    setDate(value);
  };

  const handleTextChange = value => {
    setAdditionalNotes(value);
  };

  return (
    <Fragment>
      <div className="container">
        <h2>Course:</h2>
        <ul>
          {Array.isArray(COURSE_LIST) &&
            COURSE_LIST.map(data => {
              return (
                <li key={data.id}>
                  <input
                    type="radio"
                    id={data.id}
                    name="selector"
                    onChange={() => handleCourseChange(data.id)}
                  />
                  <label htmlFor={data.id}>{data.name}</label>
                  <div className="check" />
                </li>
              );
            })}
        </ul>
        {selectedCourse ? (
          <SubjectList
            subjects={SUBJECT_LIST[selectedCourse]}
            onSubjectSelect={onSubjectSelect}
          />
        ) : null}
        <div className="date-picker">
          <label htmlFor="date">Select Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={e => handleDateChange(e.target.value)}
            format="DD MMMM, YYYY"
          />
        </div>
        <div className="text-area">
          <label htmlFor="additionalNotes">Additional Notes</label>
          <textarea
            id="additionalNotes"
            value={additionalNotes}
            onChange={event => handleTextChange(event.target.value)}
            maxLength={500}
          />
        </div>
        {errorObject.isError ? (
          <div className="error-message">
            <span className="error-text">{errorObject.message}</span>
          </div>
        ) : null}
        <button
          className="button-load"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? <i className="fa fa-refresh fa-spin"></i> : null}
          Submit
        </button>
        {isSuccess ? (
          <div className="modal-wrapper">
            <div className="modal-content">
              <p>Your course has been successfully registered.</p>
              <button
                className="button-load-modal"
                onClick={() => setSuccess(false)}
              >
                Okay
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </Fragment>
  );
}

export default App;
