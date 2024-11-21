async function checkRegistration() {
    if (typeof window.CVUploaderContract !== 'undefined') {
        try {
            // Request the user's MetaMask account address
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            const userAddress = accounts[0];  // Get the first account's address

            // Create a filter for the CVUploaded event for the userAddress
            const filter = window.CVUploaderContract.filters.CVUploaded(userAddress);

            // Query past events for the filter
            const events = await window.CVUploaderContract.queryFilter(filter);

            // Check if any event was emitted for the userAddress
            const registered = events.length > 0;

            // Log and display the registration status
            console.log("User Registration Status:", registered);
            document.getElementById('status').innerText = registered ? "CV Uploaded" : "No CV Uploaded";

            // Store the status in localStorage or sessionStorage
            sessionStorage.setItem('registered', registered);
            console.log("User Registration Status stored in session:", sessionStorage.getItem('registered'));

            if (registered) {
                // If the CV is uploaded, fetch the credentials
                await fetchUserCredentials(userAddress);
            }
        } catch (err) {
            console.error("Error checking registration:", err);
            document.getElementById('status').innerText = "Error checking registration.";
        }
    } else {
        // Handle the case where the contract is not initialized
        console.error("Contract is not defined");
        document.getElementById('status').innerText = "Contract not initialized.";
    }
}

async function generateQRCode() {
    try {
        // Request MetaMask accounts
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];

        if (!userAddress) {
            throw new Error("No MetaMask address found.");
        }

        // Clear previous QR code
        const qrCodeContainer = document.getElementById('qrCode');
        qrCodeContainer.innerHTML = ''; // Ensure the container is empty before generating a new QR code

        // Create a canvas element for the QR code
        const canvas = document.createElement('canvas');
        qrCodeContainer.appendChild(canvas);

        // Generate QR code on the canvas
        QRCode.toCanvas(canvas, userAddress, {
            width: 200,  // Set desired size
            margin: 2    // Set desired margin
        }, function (error) {
            if (error) {
                console.error("Error generating QR code:", error);
                alert("Failed to generate QR code. Please try again.");
            } else {
                console.log("QR code generated successfully.");
            }
        });
    } catch (err) {
        console.error("Error:", err.message);
        alert("Failed to fetch MetaMask address. Please connect MetaMask and try again.");
    }
}


async function fetchUserCredentials(userAddress) {
    try {
        // Call the viewAllCredentials function from the contract
        const [walletHolders, softSkills, works, educations, certifications] = await window.CVUploaderContract.viewAllCredentials(userAddress);

        // Display WalletHolder information
        console.log("Wallet Holder Information:");
        walletHolders.forEach(walletHolder => {
            console.log(walletHolder);  // Log walletHolder details, you can replace this with actual display code
            // Display on the page
            const walletDiv = document.createElement('div');
            walletDiv.innerHTML = `
            <div class="info-card">
                <div class="info-info">
                <strong>Wallet Holder:</strong><br>
                Email: ${walletHolder.email}<br>
                Name: ${walletHolder.name}
            `;
            document.getElementById('credentials').appendChild(walletDiv);
        });

        // Loop through softSkills and display them
        console.log("Soft Skills:");
        softSkills.forEach(skill => {
            console.log(skill);  // Log softSkill details
            // Display on the page
            const skillDiv = document.createElement('div');
            skillDiv.innerHTML = `
                <div class="info-card">
                <div class="info-info">
                <strong>Soft Skill:</strong><br>
                Highlight: ${skill.highlight}<br>
                Description: ${skill.description}<br>
                Level: ${skill.level}
            `;
            document.getElementById('credentials').appendChild(skillDiv);
        });

        // Loop through works and display them
        console.log("Work Experience:");
        works.forEach(work => {
            console.log(work);  // Log work details
            // Display on the page
            const workDiv = document.createElement('div');
            workDiv.innerHTML = `
                <div class="info-card">
                <div class="info-info">
                <strong>Work Experience:</strong><br>
                Title: ${work.title}<br>
                Company: ${work.company}<br>
                Industry: ${work.industry}<br>
                Country: ${work.country}<br>
                State: ${work.state}<br>
                City: ${work.city}<br>
                Description: ${work.description}<br>
                Start Date: ${work.startDate}<br>
                End Date: ${work.endDate}
            `;
            document.getElementById('credentials').appendChild(workDiv);
        });

        // Loop through educations and display them
        console.log("Education:");
        educations.forEach(education => {
            console.log(education);  // Log education details
            // Display on the page
            const educationDiv = document.createElement('div');
            educationDiv.innerHTML = `
                <div class="info-card">
                <div class="info-info">
                <strong>Education:</strong><br>
                Level: ${education.level}<br>
                Field of Study: ${education.fieldOfStudy}<br>
                Institute: ${education.instituteName}<br>
                Country: ${education.instituteCountry}<br>
                State: ${education.instituteState}<br>
                City: ${education.instituteCity}<br>
                Start Date: ${education.startDate}<br>
                End Date: ${education.endDate}
            `;
            document.getElementById('credentials').appendChild(educationDiv);
        });

        // Loop through certifications and display them
        console.log("Certifications:");
        certifications.forEach(cert => {
            console.log(cert);  // Log certification details
            // Display on the page
            const certDiv = document.createElement('div');
            certDiv.innerHTML = `
                <div class="info-card">
                <div class="info-info">
                <strong>Certification:</strong><br>
                Name: ${cert.name}<br>
                Email: ${cert.email}<br>
                Type: ${cert.certType}<br>
                Issuer: ${cert.issuer}<br>
                Description: ${cert.description}<br>
                Acquired Date: ${cert.acquiredDate}<br>
                Active: ${cert.active ? "Yes" : "No"}
            `;
            document.getElementById('credentials').appendChild(certDiv);
        });
        
    } catch (err) {
        console.error("Error fetching credentials:", err);
        document.getElementById('status').innerText = "Error fetching credentials.";
    }
}


async function fetchAndPrepareData() {
    try {
        // Fetch user data from the backend
        const response = await fetch('/getUserData');
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        // Check if the data is returned correctly
        if (!data.user || !data.certifications || !data.educations || !data.softSkills || !data.works) {
            throw new Error("Data missing from response");
        }

        // Request user accounts from MetaMask
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];

        // Prepare structured data
        const softSkillRows = data.softSkills.map(skill => ({
            softID: skill.SoftID,
            highlight: skill.SoftHighlight,
            description: skill.SoftDescription,
            level: skill.SoftLevel
        }));

        const workRows = data.works.map(work => ({
            workExpID: work.WorkExpID,
            title: work.WorkTitle,
            company: work.WorkCompany,
            industry: work.WorkIndustry,
            country: work.WorkCountry,
            state: work.WorkState,
            city: work.WorkCity,
            description: work.WorkDescription,
            startDate: work.WorkStartDate,
            endDate: work.WorkEndDate
        }));

        const educationRows = data.educations.map(edu => ({
            eduBadID: edu.EduBacID,
            level: edu.LevelEdu,
            fieldOfStudy: edu.FieldOfStudy,
            instituteName: edu.InstituteName,
            instituteCountry: edu.InstituteCountry,
            instituteState: edu.InstituteState,
            instituteCity: edu.InstituteCity,
            startDate: edu.EduStartDate,
            endDate: edu.EduEndDate
        }));

        const certificationRows = data.certifications.map(cert => ({
            certID: cert.CerID,
            name: cert.CerName,
            email: cert.CerEmail,
            certType: cert.CerType,
            issuer: cert.CerIssuer,
            description: cert.CerDescription,
            acquiredDate: cert.CerAcquiredDate,
            active: cert.Active
        }));

        const walletHolderRows = data.user.map(user => ({
            accountID: userAddress,
            email: user.Email_Address,
            name: user.Name
        }));

        // Call the smart contract functions using off-chain signing
        const signer = provider.getSigner();
        const CVUploaderWithSigner = CVUploaderContract.connect(signer);

        // Sequentially upload the data
        for (const holder of walletHolderRows) {
            const tx = await CVUploaderWithSigner.populateTransaction.uploadOrUpdateWalletHolder(holder.email, holder.name);
            await sendSignedTransaction(tx);
        }

        for (const skill of softSkillRows) {
            const tx = await CVUploaderWithSigner.populateTransaction.uploadOrUpdateSoftSkill(skill.softID, skill.highlight, skill.description, skill.level);
            await sendSignedTransaction(tx);
        }

        for (const work of workRows) {
            const tx = await CVUploaderWithSigner.populateTransaction.uploadOrUpdateWork(
                work.workExpID,
                work.title,
                work.company,
                work.industry,
                work.country,
                work.state,
                work.city,
                work.description,
                work.startDate,
                work.endDate
            );
            await sendSignedTransaction(tx);
        }

        for (const edu of educationRows) {
            const tx = await CVUploaderWithSigner.populateTransaction.uploadOrUpdateEducation(
                edu.eduBadID,
                edu.level,
                edu.fieldOfStudy,
                edu.instituteName,
                edu.instituteCountry,
                edu.instituteState,
                edu.instituteCity,
                edu.startDate,
                edu.endDate
            );
            await sendSignedTransaction(tx);
        }

        for (const cert of certificationRows) {
            const tx = await CVUploaderWithSigner.populateTransaction.uploadOrUpdateCertification(
                cert.certID,
                cert.name,
                cert.email,
                cert.certType,
                cert.issuer,
                cert.description,
                cert.acquiredDate,
                cert.active
            );
            await sendSignedTransaction(tx);
        }

        console.log("All data uploaded successfully!");

        // Redirect to the updateSuccessful.html page after all data is uploaded
        window.location.href = "updateSuccessful.html";

    } catch (err) {
        console.error("Error fetching user data:", err);
    }
}


async function uploadNewData() {
    try {
        // Fetch user data from the backend
        const response = await fetch('/getUserData');
        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }
        const data = await response.json();

        // Fetch user accounts from MetaMask
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];


        function mapBackendData(data, type) {
            switch(type) {
                case 'workExperiences':
                    return data.map(work => ({
                        workExpID: work.WorkExpID.toString(),
                        title: work.WorkTitle,
                        company: work.WorkCompany,
                        industry: work.WorkIndustry,
                        country: work.WorkCountry,
                        state: work.WorkState,
                        city: work.WorkCity,
                        description: work.WorkDescription,
                        startDate: work.WorkStartDate,
                        endDate: work.WorkEndDate
                    }));

                case 'softSkills':
                    return data.map(skill => ({
                        softID: skill.SoftID.toString(),
                        highlight: skill.SoftHighlight,
                        description: skill.SoftDescription,
                        level: skill.SoftLevel
                    }));
                
                case 'educations':
                    return data.map(edu => ({
                        eduBadID: edu.EduBacID.toString(),
                        level: edu.LevelEdu,
                        fieldOfStudy: edu.FieldOfStudy,
                        instituteName: edu.InstituteName,
                        instituteCountry: edu.InstituteCountry,
                        instituteState: edu.InstituteState,
                        instituteCity: edu.InstituteCity,
                        startDate: edu.EduStartDate,
                        endDate: edu.EduEndDate
                    }));

                case 'certifications':
                    return data.map(cert => ({
                        certID: cert.CerID.toString(),
                        name: cert.CerName,
                        email: cert.CerEmail,
                        certType: cert.CerType,
                        issuer: cert.CerIssuer,
                        description: cert.CerDescription,
                        acquiredDate: cert.CerAcquiredDate,
                        active: cert.Active
                    }));

                default:
                    return [];
            }
        }

        // Function to map contract data to a comparable format
        function mapContractData(data, type) {
            switch(type) {
                case 'workExperiences':
                    return data.map(work => ({
                        workExpID: work.workExpID.toString(),
                        title: work.title,
                        company: work.company,
                        industry: work.industry,
                        country: work.country,
                        state: work.state,
                        city: work.city,
                        description: work.description,
                        startDate: work.startDate,
                        endDate: work.endDate
                    }));

                case 'softSkills':
                    return data.map(skill => ({
                        softID: skill.softID.toString(),
                        highlight: skill.highlight,
                        description: skill.description,
                        level: skill.level
                    }));
                
                case 'educations':
                    return data.map(edu => ({
                        eduBadID: edu.eduBadID.toString(),
                        level: edu.level,
                        fieldOfStudy: edu.fieldOfStudy,
                        instituteName: edu.instituteName,
                        instituteCountry: edu.instituteCountry,
                        instituteState: edu.instituteState,
                        instituteCity: edu.instituteCity,
                        startDate: edu.startDate,
                        endDate: edu.endDate
                    }));
    
                case 'certifications':
                    return data.map(cert => ({
                        certID: cert.certID.toString(),
                        name: cert.name,
                        email: cert.email,
                        certType: cert.certType,
                        issuer: cert.issuer,
                        description: cert.description,
                        acquiredDate: cert.acquiredDate,
                        active: cert.active
                    }));

                default:
                    return [];
            }
        }

        function compareData(dbData, contractData, key) {
            const differences = [];
        
            // Iterate over the backend data
            dbData.forEach(dbItem => {
                const contractItem = contractData.find(item => item[key] === dbItem[key]);
        
                if (!contractItem) {
                    // If item does not exist in the contract data, mark it as missing
                    differences.push({ ...dbItem, status: 'Pending Upload For' });
                } else {
                    // Compare fields one by one
                    const fields = Object.keys(dbItem);
                    let isDifferent = false;
        
                    fields.forEach(field => {
                        if (dbItem[field] !== contractItem[field]) {
                            isDifferent = true;
                        }
                    });
        
                    if (isDifferent) {
                        // If any field is different, mark it as different
                        differences.push({ ...dbItem, status: 'Different in Contract' });
                    }
                }
            });
        
            return differences;
        }       

        // Map backend data
        const mappedBackendWorks = mapBackendData(data.works, 'workExperiences');
        const mappedBackendSoftSkills = mapBackendData(data.softSkills, 'softSkills');
        const mappedBackendEducations = mapBackendData(data.educations, 'educations');
        const mappedBackendCertifications = mapBackendData(data.certifications, 'certifications');
        const walletHolder = { accountID: userAddress, email: data.user.Email_Address, name: data.user.Name };

        // Fetch smart contract data (replace these calls with your actual contract fetch methods)
        const [walletHolders, softSkills, works, educations, certifications] = await window.CVUploaderContract.viewAllCredentials(userAddress);

        // Map contract data
        const mappedContractWorks = mapContractData(works, 'workExperiences');
        const mappedContractSoftSkills = mapContractData(softSkills, 'softSkills');
        const mappedContractEducations = mapContractData(educations, 'educations');
        const mappedContractCertifications = mapContractData(certifications, 'certifications');

        // Identify missing data
        const missingWorks = compareData(mappedBackendWorks, mappedContractWorks, 'workExpID')
        const missingSoftSkills = compareData(mappedBackendSoftSkills, mappedContractSoftSkills, 'softID')
        const missingEducations = compareData(mappedBackendEducations, mappedContractEducations, 'eduBadID')
        const missingCertifications = compareData(mappedBackendCertifications, mappedContractCertifications, 'certID')

        // Prepare to upload data
        const signer = provider.getSigner();
        const CVUploaderWithSigner = CVUploaderContract.connect(signer);

        // Sequentially upload missing data
        for (const work of missingWorks) {
            const tx = await CVUploaderWithSigner.populateTransaction.uploadOrUpdateWork(
                parseInt(work.workExpID, 10),
                work.title,
                work.company,
                work.industry,
                work.country,
                work.state,
                work.city,
                work.description,
                work.startDate,
                work.endDate
            );
            await sendSignedTransaction(tx);
        }

        for (const skill of missingSoftSkills) {
            const tx = await CVUploaderWithSigner.populateTransaction.uploadOrUpdateSoftSkill(
                parseInt(skill.softID, 10),
                skill.highlight,
                skill.description,
                skill.level
            );
            await sendSignedTransaction(tx);
        }

        for (const edu of missingEducations) {
            const tx = await CVUploaderWithSigner.populateTransaction.uploadOrUpdateEducation(
                parseInt(edu.eduBadID, 10),
                edu.level,
                edu.fieldOfStudy,
                edu.instituteName,
                edu.instituteCountry,
                edu.instituteState,
                edu.instituteCity,
                edu.startDate,
                edu.endDate
            );
            await sendSignedTransaction(tx);
        }

        for (const cert of missingCertifications) {
            const tx = await CVUploaderWithSigner.populateTransaction.uploadOrUpdateCertification(
                parseInt(cert.certID, 10),
                cert.name,
                cert.email,
                cert.certType,
                cert.issuer,
                cert.description,
                cert.acquiredDate,
                cert.active
            );
            await sendSignedTransaction(tx);
        }

        console.log("Missing data uploaded successfully!");
        // Redirect to a success page
        window.location.href = "updateSuccessful.html";

    } catch (err) {
        console.error("Error uploading missing data:", err);
    }
}


// Helper function to sign and send transactions
async function sendSignedTransaction(tx) {
    try {
        const signer = provider.getSigner();
        const gasLimit = await provider.estimateGas(tx);
        tx.gasLimit = gasLimit;

        const signedTx = await signer.sendTransaction(tx);
        const receipt = await signedTx.wait(); // Wait for the transaction to be mined
        console.log("Transaction successful:", receipt.transactionHash);
    } catch (err) {
        console.error("Error sending transaction:", err);
    }
}


async function getViewRequests() {
    // Assume user address is available in sessionStorage or you can get it from MetaMask
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const userAddress = accounts[0];

    // Fetch all view requests for the current user
    const filter = SubscripRequestContract.filters.ViewRequest(userAddress, null, null, null, null);
    const events = await SubscripRequestContract.queryFilter(filter);

    // Create a map to store the latest response for each requestIndex
    const latestRequests = {};

    // Loop through each event and track the latest response by requestIndex
    events.forEach(event => {
        const { walletHolder, recruiter, segmentType, status, requestIndex } = event.args;

        // Check if we need to update the latest status for the requestIndex
        if (!latestRequests[requestIndex] || latestRequests[requestIndex].blockNumber < event.blockNumber) {
            latestRequests[requestIndex] = {
                walletHolder,
                recruiter,
                segmentType,
                status,
                requestIndex,
                blockNumber: event.blockNumber, // store the blockNumber
            };
        }
    });

    // Check if any requests exist and render them
    const viewRequestContainer = document.getElementById('viewRquest');
    viewRequestContainer.innerHTML = ''; // Clear any previous content

    if (Object.keys(latestRequests).length > 0) {
        // Sort requests by blockNumber in descending order
        const sortedRequests = Object.values(latestRequests).sort((a, b) => b.blockNumber - a.blockNumber);

        // Loop through the sorted requests and display them
        sortedRequests.forEach(request => {
            const { walletHolder, recruiter, segmentType, status, requestIndex } = request;

            // Create HTML content for each request
            const requestElement = document.createElement('div');
            requestElement.classList.add('request-info');
            requestElement.innerHTML = `
     
            <div class="plan-card"  style="margin-top:20px;">
                <div class="plan-info">
                      <h5>Request #${10 + requestIndex} Details:</h5>  <!-- Add 1 to index -->
                <p><strong>Requested by Recruiter:</strong> ${recruiter}</p>
                <p><strong>Segment:</strong> ${SegmentType[segmentType]}</p>
                <p><strong>Status:</strong> ${RequestStatus[status]}</p>
                </div>
            </div>
           
           
  
              
            `;

            // Only add the "Response" button if the status is Pending (status === 0)
            if (status === 0) { // Status 0 corresponds to "Pending"
                const responseButton = document.createElement('button');
                responseButton.textContent = "Response";
                responseButton.onclick = () => {
                    // Redirect to the confirmation page with the request details
                    sessionStorage.setItem('requestAction', 'response'); // Action will be 'response'
                    sessionStorage.setItem('requestIndex', requestIndex.toString());
                    sessionStorage.setItem('recruiter', recruiter);
                    sessionStorage.setItem('segmentType', SegmentType[segmentType]);
                    window.location.href = 'viewConfirmation.html';
                };

                // Append the response button to the request element
                requestElement.appendChild(responseButton);
            }

            // Append the request details to the container
            viewRequestContainer.appendChild(requestElement);
        });
    } else {
        // No requests found, display a message
        const noRequestMessage = document.createElement('div');
        noRequestMessage.classList.add('no-request-message');
        noRequestMessage.innerHTML = `<p>No requests received yet.</p>`;

        // Append the no request message to the container
        viewRequestContainer.appendChild(noRequestMessage);
    }
}


// Enum mappings for SegmentType and RequestStatus to human-readable text
const SegmentType = ["All", "Work & Soft Skill", "Education & Certification"];
const RequestStatus = ["Pending", "Accepted", "Rejected"];


async function handleResponse(requestIndex, response) {
    // Connect to MetaMask and get the current account
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const userAddress = accounts[0];

    // Convert response string to enum value
    const responseEnum = response === 'Accepted' ? 1 : 2; // Assuming 1 = Accepted, 2 = Rejected

    try {
        // Create a signer from MetaMask using Web3Provider
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner(); // Get signer from MetaMask

        // Attach the signer to the contract
        const contractWithSigner = window.SubscripRequestContract.connect(signer);

        // Call the smart contract function to update the request status
        const tx = await contractWithSigner.respondToRequest(userAddress, requestIndex, responseEnum);

        // Wait for the transaction to be mined
        await tx.wait();

        // Provide feedback to the user
        alert(`Request has been ${response.toLowerCase()} successfully!`);

        // Redirect user to the previous page (or wherever you want)
        window.location.href = 'viewRquest.html';
    } catch (error) {
        console.error("Error executing the transaction:", error);
        alert("There was an error processing your request.");
    }
}




