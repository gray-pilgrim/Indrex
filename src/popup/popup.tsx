import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../assets/tailwind.css';

// Icons for recording options
import screenCamIcon from '../assets/Banner.png';
import screenOnlyIcon from '../assets/Banner.png';
import camOnlyIcon from '../assets/Banner.png';

const Popup = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  // States for disability and recording options
  const [disabilitySelection, setDisabilitySelection] = useState('');
  const [recordingSelection, setRecordingSelection] = useState('screen-cam');
  const [recordingIcon, setRecordingIcon] = useState(screenCamIcon);

  // States for the review form
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]); // State to hold the list of reviews

  const [htmlContent, setHtmlContent] = useState('');


  // Load reviews from chrome.storage when the component mounts
  useEffect(() => {
    // Listen for messages from the content script

    // Fetch reviews from storage
    chrome.storage.sync.get(['reviews']).then((result) => {
      if (result.reviews) {
        setReviews(result.reviews);
      }
    });
    chrome.runtime.onMessage.addListener((message) => {
      if (message.html) {
        setHtmlContent(message.html);
      }
    });
    
    chrome.runtime.onMessage.addListener((message) => {
      if (message.html) {
        const htmlContent = message.html;
        document.getElementById('htmlContent').textContent = htmlContent;
    
        fetch('http://localhost:5000/receive_html', {
          method: 'POST',
          body: htmlContent,
          headers: {
            'Content-Type': 'text/plain'
          }
        })
        .then(response => response.text())
        .then(data => {
          console.log('Server Response:', data);
          // Update the popup with the server response
          document.getElementById('serverResponse').textContent = data;
        })
        .catch(error => console.error('Error:', error));
      }
    });
    
    
    // Trigger the content script to send HTML when the popup is opened
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ['contentScript.js']
      });
    });
    
  }, []);

  // Handlers for disability and recording options
  const handleDisabilitySelectionChange = (event) => {
    setDisabilitySelection(event.target.value);
  };

  const handleRecordingSelectionChange = (event) => {
    setRecordingSelection(event.target.value);
    switch (event.target.value) {
      case 'screen-cam':
        setRecordingIcon(screenCamIcon);
        break;
      case 'screen-only':
        setRecordingIcon(screenOnlyIcon);
        break;
      case 'cam-only':
        setRecordingIcon(camOnlyIcon);
        break;
      default:
        setRecordingIcon(null); // or a default icon
    }
  };

  const startRecording = () => {
    console.log('Recording option selected:', recordingSelection);
  
    // Send a message to the active tab to fetch HTML content
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "fetchHTML" });
    });
  };

  // Function to handle review form submission
  const submitReview = (event) => {
    event.preventDefault();
    const newReview = { name, review };
    const updatedReviews = [...reviews, newReview];

    // Save the updated reviews array to chrome.storage
    chrome.storage.sync.set({ reviews: updatedReviews }).then(() => {
      console.log('Review submitted:', newReview);
      setReviews(updatedReviews); // Update state with new review
    });

    // Reset form fields
    setName('');
    setReview('');
  };

  return (
    <div className="p-4">
    <h1 className="text-5xl text-green-500 mb-4">The Great Extension</h1>
    
    {/* Disability and recording options from code1.tsx */}
    <div className="mb-4">
      <select
        value={disabilitySelection}
        onChange={handleDisabilitySelectionChange}
        className="border border-gray-300 rounded p-2"
      >
        <option value="">Select disability type</option>
        <option value="Blindness">Blindness</option>
        <option value="Deafness">Deafness</option>
        <option value="Non-Verbal">Non-Verbal</option>
        <option value="Low-Vision">Low-vision</option>
        <option value="Hard of Hearing">Hard of Hearing</option>
        <option value="Paraplegic">Paraplegia</option>
        {/* ... other disability options ... */}
      </select>
    </div>
    <div className="mb-4 flex items-center">
      <select
        value={recordingSelection}
        onChange={handleRecordingSelectionChange}
        className="border border-gray-300 rounded p-2"
      >
        <option value="screen-cam">Analyse and Suggest</option>
        <option value="screen-only">Analyse only</option>
        <option value="cam-only">Suggest only</option>
      </select>
      {recordingIcon && <img src={recordingIcon} alt="Recording option icon" className="ml-2" />}
    </div>
    <button
      onClick={startRecording}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      Start recording
    </button>


    <head>
    <title>Extracted HTML</title>
</head> 
<body>
    <h1>Extracted HTML:</h1>
    <textarea id="htmlContent"></textarea>
    <h2>Server Response:</h2>
    <div id="serverResponse"></div>
    <script src="popup.js"></script>
</body>

    {/* Review section from code2.tsx */}
      <div className="review-section h-40 overflow-auto border border-gray-300 p-2 my-4">
        {reviews.map((review, index) => (
          <div key={index} className="review mb-2">
            <h5 className="font-bold">{review.name}</h5>
            <p>{review.review}</p>
          </div>
        ))}
      </div>

      <form onSubmit={submitReview} className="mb-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="border border-gray-300 rounded p-2 w-full mb-2"
        />
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Your review"
          className="border border-gray-300 rounded p-2 w-full mb-2"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit Review
        </button>
      </form>
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Popup />);

export default Popup;
