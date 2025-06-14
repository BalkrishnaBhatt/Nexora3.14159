"use client"

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import React, { useState } from "react";
import { AzureOpenAI } from "openai";
import Image from "next/image";
import styles from "./page.module.css";


export default function Home() {

  const [selectedFile, setSelectedFile] = useState(null);
  const [text1, setText1] = useState("");
  const [output, setOutput] = useState("");
  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append(
      "myFile",
      selectedFile,
      selectedFile.name
    );
    console.log(selectedFile);
    //axios.post("api/uploadfile", formData);
  };

  const fileData = () => {
    if (selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>
          <p>File Name: {selectedFile.name}</p>
          <p>File Type: {selectedFile.type}</p>
          <p>
            Last Modified: {selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    } else {
      return (
        <div>
          <br />

        </div>
      );
    }
  };

  async function Uploadclick() {
    await model(text1);
  }


  async function model(text1) {
    console.log(text1, "TTTTTTTTT777")
    const endpoint = "https://bh-uk-openai-thedatawatchers.openai.azure.com/";
    const modelName = "gpt-4o";
    const deployment = "gpt-4o-2";
    const apiKey = "721682045c2140b482f47efff0ad0cd2";
    const apiVersion = "2024-04-01-preview";
    const options = { endpoint, apiKey, deployment, apiVersion, dangerouslyAllowBrowser: true }
    const client = new AzureOpenAI(options);

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: modelContent },
        { role: "user", content: text1 }
      ],
      max_tokens: 4096,
      temperature: 0.5,
      top_p: 0.95,
      model: modelName
    });

    if (response?.error !== undefined && response.status !== "200") {
      throw response.error;
    }
    setOutput(response.choices[0].message.content)
    console.log(response.choices[0].message.content);
  }

  model().catch((err) => {
    console.error("The sample encountered an error:", err);
  });


  return (

    <div className={styles.page}>
            <div className={styles.logoHeader}>
  <Image
    src="/nexora.png"
    alt="Nexora Logo"
    width={100}
    height={100}
    priority
  />
  <h1 className={styles.title}>Nexora 3.141</h1>
</div>
<h4 className={styles.subtitle}>
  "ReIMAGINE Analytics: From Data Silos to Conversational Insights"
</h4>
      <div className={styles.upload_container}>
        <input type="file" onChange={onFileChange} className={styles.file_input} />
        <button onClick={Uploadclick} className={styles.upload_button}>Upload!</button>
      </div>
      <div className={styles.chat_input_container}>
        <input
          className={styles.chat_input}
          placeholder="Add your Prompt..."
          value={text1}
          onChange={e => setText1(e.target.value)}
          name="myInput"
          onKeyDown={e => { if (e.key === "Enter") Uploadclick(); }}
          autoComplete="off"
        />
        <button className={styles.send_button} onClick={Uploadclick} aria-label="Send">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
          </svg>
        </button>
      </div>

      {/* 
      <input placeholder="Add a prompt!! " onChange={e => { setText1(e.target.value) }} name="myInput" /> */}

      {
        output.length > 1 && <div className={styles.centered_output_box}>

          <ReactMarkdown rehypePlugins={[remarkGfm]}>
            {output || ""}
          </ReactMarkdown>
        </div>
      }




      {fileData()}
    </div>
  );
}


let modelContent = "You are a data analyst. I will provide you with one or more datasets that may include a mix of structured data (CSV tables, JSON records, database extracts) and unstructured data (plain-text documents, logs, notes). Your job is to: Ingest & Classify: Determine which inputs are structured (rows/columns, JSON fields) and which are unstructured (free text). For structured data: list each table or file, its column names, and inferred data types (numeric, categorical, date/time, text). For unstructured data: perform basic NLP to identify main topics, named entities, or recurring themes. Data Overview: Report how many records/rows exist for each structured dataset. Summarize each unstructured document by word count and number of separate entries. For each structured dataset, note any columns that appear to be primary key candidates (unique identifiers) or foreign key candidates (columns whose values appear to match key columns in other tables). If multiple structured datasets are provided, compare their schemas and identify any columns that likely map between tables (e.g., matching names or value patterns). Describe those potential relationships. Summary Statistics & Key Values: For every numeric column, compute and present: Count of non-null entries, Mean, median, standard deviation, minimum, and maximum, Notes on outliers (for example, values that lie outside the 95th percentile). For every categorical column, list the top categories and their frequencies. For every date/time column, specify the earliest and latest values and comment on any notable patterns (e.g., seasonality or gaps). From unstructured text: List the top 10 most frequent words (excluding common stopwords) along with their counts. Identify prominent named entities (people, organizations, locations) and how often they appear. Summarize overall sentiment or tone if applicable (for example, positive vs. negative mentions). Key Observations & Enriched Insights: Provide a detailed narrative highlighting the most important findings across both structured and unstructured inputs. For each dataset, include: Unusual data patterns (e.g., large numbers of missing values, extreme outliers, unexpected distributions). Significant correlations or relationships (for example, “Column A tends to be high when Column B is low” or “customers in Region X have 40% higher average spending than Region Y”). Any primary/foreign key relationships discovered within a single table or across multiple tables (e.g., “customer_id in Orders appears to match the primary customer_id in Customers, suggesting Orders → Customers mapping”). Recurring themes or issues from unstructured text (for example, “tickets mentioning ‘late delivery’ account for 30% of all support cases”). For each insight, describe why it matters and what action it suggests (for example, “High outliers in shipment_time indicate potential logistic bottlenecks—investigate warehouse delays”). Organize the Output: Structure your response into these sections: I. Data Overview & Schema Mapping: List each dataset, its type (structured or unstructured), number of records, and schema details. Identify candidate primary keys and foreign keys, and—if multiple tables—outline any inferred mappings. II. Summary Statistics & NLP Findings: Numeric summaries, categorical frequencies, date/time overviews. NLP summary for each unstructured text block (top words, named entities, sentiment). III. Enriched Key Observations: Detailed, narrative insights for each dataset, highlighting anomalies, correlations, and theme discoveries. Explicit notes on primary/foreign key relationships and cross-dataset mappings. V. Recommendations & Next Steps (Optional): Suggest follow-up analyses or data-quality checks—for example, “Verify why 15% of entries lack a Customer_ID” or “Drill into support tickets referencing ‘error code 503’ for root-cause analysis.” Provide all tables or charts inline if the interface supports it; do not show any code. Use clear, human-readable language and Markdown formatting for tables and headings. Respond thoroughly and concisely."
