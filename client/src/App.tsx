import React, { useState, useEffect } from "react";
import logo from "./GitHub-Mark-Light-120px-plus.png";
import "./App.css";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-monokai";

const apiUrl = "https://ufgjji253b.execute-api.us-east-1.amazonaws.com/prod";
const defaultJsonObject = '{\n\t"foo": 5 \n}';
const loadingMessage = "# loading...";
const invalidJsonMessage = "# invalid json";

type RequestBody = {
  data: string;
};

function App() {
  const [jsonObject, setJsonObject] = useState(defaultJsonObject);
  const [pydanticModel, setPydanticModel] = useState("");

  useEffect(() => {
    if (validJson(jsonObject)) {
      fetchConversion(jsonObject);
    } else {
      setPydanticModel(invalidJsonMessage);
    }
  }, [jsonObject]);

  function validJson(newValue: string): boolean {
    try {
      JSON.parse(newValue);
    } catch (_) {
      return false;
    }
    return true;
  }

  function onChange(newValue: string) {
    setJsonObject(newValue);
  }

  function fetchConversion(newValue: string) {
    console.log("fetching");
    setPydanticModel(loadingMessage);
    const requestBody: RequestBody = { data: newValue };
    const url = new URL(apiUrl);
    const opts = {
      method: "POST",
      body: JSON.stringify(requestBody),
    };

    fetch(url.toString(), opts)
      .then((response) => {
        if (response.status === 422) {
          setPydanticModel(invalidJsonMessage);
        }
        return response.json();
      })
      .then((data) => {
        setPydanticModel(data.model);
      });
  }

  return (
    <div className="App">
      <h1>JSON to Pydantic Converter</h1>
      <div className="editor-container">
        <div className="editor">
          <h3>JSON</h3>
          <AceEditor
            value={jsonObject}
            mode="json"
            theme="monokai"
            onChange={onChange}
            name="json-editor"
            editorProps={{ $blockScrolling: true }}
          />
        </div>
        <div className="editor">
          <h3>Pydantic</h3>
          <AceEditor
            value={pydanticModel}
            mode="python"
            theme="monokai"
            name="python-editor"
            editorProps={{ $blockScrolling: true }}
          />
        </div>
      </div>
      <br></br>
      <div className="about">
        <h2>What is this?</h2>
        <p>
          JSON to Pydantic is a tool that lets you convert JSON objects into
          Pydantic models. <a href="https://www.json.org/json-en.html">JSON</a>{" "}
          is the de-facto data interchange format of the internet, and{" "}
          <a href="https://pydantic-docs.helpmanual.io/">Pydantic</a> is a
          library that makes parsing JSON in Python a breeze.
        </p>
        <p>
          To generate a Pydantic model from a JSON object, enter it into the
          JSON editor and watch a Pydantic model automagically appear in the
          Pydantic editor.
        </p>
        <p>
          Pydantic models are generated via the experimental{" "}
          <a href="https://github.com/koxudaxi/datamodel-code-generator">
            datamodel-code-generator
          </a>
          .
        </p>
      </div>
      <a href="https://github.com/brokenloop/jsontopydantic">
        <img id="github-logo" src={logo} alt="GitHub Logo" />
      </a>
    </div>
  );
}

export default App;
