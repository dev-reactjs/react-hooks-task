import React from "react";
import "./App.css";

function SubjectList(props) {
  const { subjects, onSubjectSelect } = props;
  return (
    <div>
      <h2>Subject</h2>
      {subjects.map(data => {
        return (
          <label className="checkbox-container" key={data.id}>
            <span>{data.name}</span>
            <input type="checkbox" onChange={() => onSubjectSelect(data.id)} />
            <span className="check-mark" />
          </label>
        );
      })}
    </div>
  );
}

export default SubjectList;
