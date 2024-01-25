import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Helmet } from 'react-helmet';
import '../assets/tailwind.css';
import { getFirestore, addDoc, getDocs, collection } from "firebase/firestore";


// Icons for recording options
import screenCamIcon from '../assets/Banner.png';
import screenOnlyIcon from '../assets/Banner.png';
import camOnlyIcon from '../assets/Banner.png';
import firebase from './firebase';

const db = getFirestore(firebase);



const saveIntoDb = async (name: string, type: string, reviews: string) => {

  try {
    const docRef = await addDoc(collection(db, "main-db"), {
      name: name,
      type: type,
      reviews: reviews,
    });

    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

const getDataFromDB = async () => {
  const querySnapshot = await getDocs(collection(db, "main-db"));
  querySnapshot.forEach((doc) => {
    alert(`${doc.id} => ${JSON.stringify(doc.data())}`);
  });
}


const Popup = () => {
  const [inclusivityRating, setInclusivityRating] = useState(0);
  const [isRequestInProgress, setIsRequestInProgress] = useState(false);
  const [inclusivityAnalysis, setInclusivityAnalysis] = useState('');
  const [augmentingProducts, setAugmentingProducts] = useState([]);
  const [currentUrl, setCurrentUrl] = useState('');
  // States for disability and recording options
  const [prelimSelection, setpreliminarySelection] = useState(''); // This is the preliminary selection [Blindness, Deafness, Non-Verbal, Low-Vision, Hard of Hearing, Paraplegic
  const [disabilitySelection, setDisabilitySelection] = useState('');
  const [recordingSelection, setRecordingSelection] = useState('cam-only');
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
        fetch('http://localhost:5000/receive_html', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ htmlContent: message.html, disabilityType: message.disabilityType, preliminaryType: message.preliminaryType })
        })
        .then(response => response.json())
        .then(data => {
          setInclusivityAnalysis(data.inclusivity_analysis);
          setAugmentingProducts(data.augmenting_products || []);
          setInclusivityRating(data.inclusivity_rating); // Update inclusivity rating
          setIsRequestInProgress(false);
        })
        .catch(error => {
          console.error('Error:', error);
          setIsRequestInProgress(false);
        });
      }
    });
    



    // Trigger the content script to send HTML when the popup is opened
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
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

  const handlepreliminarySelectionChange = (event) => {
    setpreliminarySelection(event.target.value);
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
    // Prevent multiple requests if one is already in progress
    if (isRequestInProgress) {
      return;
    }

    setIsRequestInProgress(true); // Set to true when request starts
    console.log('Recording option selected:', recordingSelection);
    console.log('Disability Type:', disabilitySelection);

    // Send a message to the active tab to fetch HTML content along with the disability type
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "fetchHTML", disabilityType: disabilitySelection, preliminaryType: prelimSelection });
    });
  };

  // Function to handle review form submission
  const submitReview = (event) => {
    event.preventDefault();
    const newReview = { name, review };
    const updatedReviews = [...reviews, newReview];

    saveIntoDb(name, prelimSelection, review);

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
      <h1 className="text-5xl text-green-500 mb-4">INDREX</h1>

      <Helmet>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@1/css/pico.min.css" />
        <title>Disability Analysis Tool</title>
      </Helmet>
      {/* Disability and recording options from code1.tsx */}
      <div>
        <select
          value={prelimSelection}
          onChange={(e) => setpreliminarySelection(e.target.value)}
          className="border border-gray-300 rounded p-2"
          name="disabilityType" id="disabilityType">
          <option value="">Select disability type</option>
          <option value="Blindness">Blindness</option>
          <option value="Deafness">Deafness</option>
          <option value="Nonverbal">Non-Verbal</option>
          <option value="Lowvision">Low-vision</option>
          <option value="HardofHearing">Hard of Hearing</option>
          {/* ... other disability options ... */}
        </select>
      </div>

      <div className="mb-4">
        <input type="text" id="output" name="Additional Details"
          value={disabilitySelection}
          onChange={(e) => setDisabilitySelection(e.target.value)}
          className="border border-gray-300 rounded p-2"
          placeholder="Enter Additional Details" aria-label="Additional Details" required
        />
      </div>
      <button
        onClick={startRecording}
        className="bg-red-500 text-white px-4 py-2 rounded"
      >
        Analyze
      </button>
      <div>
    <h2>Inclusivity Rating: {inclusivityRating}</h2> {/* Display inclusivity rating */}
  </div>
  <div>
    <textarea
      id="output"
      name="output"
      placeholder="output"
      aria-label="output"
      value={inclusivityAnalysis} // Display inclusivity analysis
      readOnly
      className="border border-gray-300 rounded p-2 w-full"
      style={{ minHeight: '50px', resize: 'none' }} // Set minimum height and disable manual resizing
    />
  </div>
      <div>
        <h2>Augmenting Products</h2>
        <ul>
          {augmentingProducts.map((product, index) => (
            <li key={index}>{product}</li>
          ))}
        </ul>
      </div>
      <section aria-label="Subscribe example">
        <div className="container">
          <article>
            <hgroup>
              <h2>Feedback</h2>
              <h3>Share Your Experience</h3>
            </hgroup>

            <form onSubmit={submitReview} className="mb-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="firstname"
                name="firstname"
                placeholder="Name"
                aria-label="Name"
                required
              />
              <input
                type="text"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                id="opinion"
                name="opinion"
                placeholder="Opinion"
                aria-label="Opinion"
                required
              />
              <button type="submit" color='blue'>Submit</button>
            </form>

          </article>
        </div>
      </section>

      {/* Review section from code2.tsx */}
      <div className="review-section h-40 overflow-auto border border-gray-300 p-2 my-4">
        {reviews.map((review, index) => (
          <div key={index} className="review mb-2">
            <h5 className="font-bold">{review.name}</h5>
            <p>{review.review}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const container = document.createElement('div');
document.body.appendChild(container);
const root = createRoot(container);
root.render(<Popup />);

export default Popup;
