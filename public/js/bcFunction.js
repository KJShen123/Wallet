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
                <strong>Work Experience:</strong><br>
                Title: ${work.title}<br>
                Company: ${work.company}<br>
                Industry: ${work.industry}<br>
                Country: ${work.country}<br>
                State: ${work.state}<br>
                City: ${work.city}<br>
                Description: ${work.description}<br>
                Start Date: ${new Date(work.startDate * 1000).toLocaleDateString()}<br>
                End Date: ${new Date(work.endDate * 1000).toLocaleDateString()}
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
                <strong>Education:</strong><br>
                Level: ${education.level}<br>
                Field of Study: ${education.fieldOfStudy}<br>
                Institute: ${education.instituteName}<br>
                Country: ${education.instituteCountry}<br>
                State: ${education.instituteState}<br>
                City: ${education.instituteCity}<br>
                Start Date: ${new Date(education.startDate * 1000).toLocaleDateString()}<br>
                End Date: ${new Date(education.endDate * 1000).toLocaleDateString()}
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
                <strong>Certification:</strong><br>
                Name: ${cert.name}<br>
                Email: ${cert.email}<br>
                Type: ${cert.certType}<br>
                Issuer: ${cert.issuer}<br>
                Description: ${cert.description}<br>
                Acquired Date: ${new Date(cert.acquiredDate * 1000).toLocaleDateString()}<br>
                Active: ${cert.active ? "Yes" : "No"}
            `;
            document.getElementById('credentials').appendChild(certDiv);
        });
        
    } catch (err) {
        console.error("Error fetching credentials:", err);
        document.getElementById('status').innerText = "Error fetching credentials.";
    }
}



// Function to upload the CV data to the smart contract
async function uploadCVData(softSkillRows, workRows, educationRows, certificationRows, walletHolderRows) {
    try {
        // Check if the contract is correctly initialized
        if (typeof window.CVUploaderContract !== 'undefined') {
            throw new Error("CVUploaderContract is not initialized");
        }

        // Call the contract method to upload data
        const tx = await window.CVUploaderContract.uploadAllData(
            softSkillRows,
            workRows,
            educationRows,
            certificationRows,
            walletHolderRows
        );

        // Wait for the transaction to be mined
        await tx.wait();

        alert("CV data uploaded successfully!");

    } catch (err) {
        console.error("Error uploading data:", err);
        alert("Error uploading CV data. Please try again.");
    }
}


async function fetchAndPrepareData() {
    try {
        // Make a GET request to the backend route
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

        // Prepare softSkillRows
        const softSkillRows = data.softSkills.map(skill => ({
            softID: skill.SoftID,
            accountID: userAddress,
            highlight: skill.SoftHighlight,
            description: skill.SoftDescription,
            level: skill.SoftLevel
        }));

        // Prepare workRows
        const workRows = data.works.map(work => ({
            workExpID: work.WorkExpID,
            accountID: userAddress,
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

        // Prepare educationRows
        const educationRows = data.educations.map(edu => ({
            eduBadID: edu.EduBacID,
            accountID: userAddress,
            level: edu.LevelEdu,
            fieldOfStudy: edu.FieldOfStudy,
            instituteName: edu.InstituteName,
            instituteCountry: edu.InstituteCountry,
            instituteState: edu.InstituteState,
            instituteCity: edu.InstituteCity,
            startDate: edu.EduStartDate,
            endDate: edu.EduEndDate
        }));

        // Prepare certificationRows
        const certificationRows = data.certifications.map(cert => ({
            certID: cert.CertID,
            accountID: userAddress,
            name: cert.CerName,
            email: cert.CerEmail,
            certType: cert.CerType,
            issuer: cert.CerIssuer,
            description: cert.CerDescription,
            acquiredDate: cert.CerAcquiredDate,
            Active: cert.Active
        }));

        // Prepare walletHolderRows
        const walletHolderRows = data.user.map(user => {
            const walletHolder = {
                accountID: userAddress,
                email: user.Email_Address,
                name: user.Name
            };
            console.log("Mapped Wallet Holder: ", walletHolder);  // Log each wallet holder
            return walletHolder;
        });

        console.log("Final Wallet Holder Rows: ", walletHolderRows); 

        console.log(softSkillRows, workRows, educationRows, certificationRows, walletHolderRows);

        // Call the smart contract to upload data
        await uploadCVData(softSkillRows, workRows, educationRows, certificationRows, walletHolderRows);

    } catch (err) {
        console.error("Error fetching user data:", err);
    }
}