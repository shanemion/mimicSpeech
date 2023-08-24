import React from 'react';

const SentencesHeader = ({ selectedPage, setSelectedPage }) => {
  return (
    <>
      {selectedPage !== "Practice" && (
        <div className="response-options">
          <button
            className={
              selectedPage === "One"
                ? "response-option-selected"
                : "response-option"
            }
            onClick={() => {
              setSelectedPage("One");
              localStorage.setItem("selectedPage", "One");
            }}
          >
            Chinese, Pinyin, and English
          </button>
          <button
            className={
              selectedPage === "Two"
                ? "response-option-selected"
                : "response-option"
            }
            onClick={() => {
              setSelectedPage("Two");
              localStorage.setItem("selectedPage", "Two");
            }}
          >
            Chinese and Pinyin
          </button>
          <button
            className={
              selectedPage === "Three"
                ? "response-option-selected"
                : "response-option"
            }
            onClick={() => {
              setSelectedPage("Three");
              localStorage.setItem("selectedPage", "Three");
            }}
          >
            Chinese
          </button>
        </div>
      )}
      {selectedPage === "Practice" && (
        <div className="response-options">
          Practice Mode
        </div>
      )}
    </>
  );
};

export default SentencesHeader;