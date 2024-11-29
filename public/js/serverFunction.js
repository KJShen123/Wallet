async function fetchUserData() {
    try {
        // Make a GET request to the backend route
        const response = await fetch('/getUserData');

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        // Display user info
        const userContainer = document.getElementById('user');
        data.user.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'question-text';
            userDiv.innerHTML = `
                <strong>Name:</strong> ${user.Name} <br>
                <strong>Email:</strong> ${user.Email_Address} <br> 
                <strong>Age:</strong> ${user.Age} <br> <hr>`;
                userContainer.appendChild(userDiv);
        });

        
        // Display works
        const workContainer = document.getElementById('works');
        data.works.forEach(work => {
            const workDiv = document.createElement('div');
            workDiv.className = 'question-text';
            workDiv.innerHTML = `
                <strong>Work Title:</strong> ${work.WorkTitle} <br> 
                <strong>Company:</strong> ${work.WorkCompany} <br> 
                <strong>Industry:</strong> ${work.WorkIndustry} <br> 
                <strong>Country:</strong> ${work.WorkCountry} <br> 
                <strong>State:</strong> ${work.WorkState} <br> 
                <strong>City:</strong> ${work.WorkCity} <br> 
                <strong>Description:</strong> ${work.WorkDescription} <br> 
                <strong>Start Date:</strong> ${work.WorkStartDate} <br> 
                <strong>End Date:</strong> ${work.WorkEndDate} <hr>`;
            workContainer.appendChild(workDiv);
        });

           // Display educations
           const eduContainer = document.getElementById('educations');
           data.educations.forEach(edu => {
               const eduDiv = document.createElement('div');
               eduDiv.className = 'question-text';
               eduDiv.innerHTML = `
                   <strong>Education Level:</strong> ${edu.LevelEdu} <br>
                   <strong>Field Of Study:</strong> ${edu.FieldOfStudy} <br>
                   <strong>Institute Name:</strong> ${edu.InstituteName} <br>
                   <strong>Institute Country:</strong> ${edu.InstituteCountry} <br>
                   <strong>Institute State:</strong> ${edu.InstituteState} <br>
                   <strong>Institute City:</strong> ${edu.InstituteCity} <br>
                   <strong>Start Date:</strong> ${edu.EduStartDate} <br>
                   <strong>End Date:</strong> ${edu.EduEndDate} <hr>`;
               eduContainer.appendChild(eduDiv);
           });

        // Display certifications
        const certContainer = document.getElementById('certifications');
        data.certifications.forEach(cert => {
            const certDiv = document.createElement('div');
            const acquiredDate = new Date(cert.CerAcquiredDate);
            const formattedDate = acquiredDate.toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            });
            certDiv.className = 'question-text';
            certDiv.innerHTML = `
                <strong>Certification:</strong> ${cert.CerName} <br>
                <strong>Email:</strong> ${cert.CerEmail} <br>
                <strong>Type:</strong> ${cert.CerType} <br>
                <strong>Issuer:</strong> ${cert.CerIssuer} <br>
                <strong>Description:</strong> ${cert.CerDescription} <br>
                <strong>Acquired Date:</strong> ${formattedDate} <br> 
                <strong>Active:</strong> ${cert.Active ? "Yes" : "No"} <hr>`;
            certContainer.appendChild(certDiv);
        });

        // Display soft skills
        const skillContainer = document.getElementById('softSkills');
        data.softSkills.forEach(skill => {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'question-text';
            skillDiv.innerHTML = `
                <strong>Soft Skill:</strong> ${skill.SoftHighlight} <br> 
                <strong>Description:</strong> ${skill.SoftDescription} <br> 
                <strong>Level:</strong> ${getLevelText(skill.SoftLevel)}`;
            skillContainer.appendChild(skillDiv);
        });

    } catch (err) {
        console.error("Error fetching user data:", err);
    }
}

// Function to convert level to text
function getLevelText(level) {
    switch (level) {
        case 1: return 'Beginner';
        case 2: return 'Intermediate';
        case 3: return 'Advanced';
        case 4: return 'Expert';
        case 5: return 'Master';
        default: return 'Unknown';
    }
}


async function compareAndShowDifferences() {
    try {
        // Fetch data from the backend (database)
        const response = await fetch('/getUserData');
        if (!response.ok) {
            throw new Error("Failed to fetch data from the server");
        }
        const data = await response.json();

        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];

        // Fetch data from the smart contract (blockchain)
        const [walletHolders, softSkills, works, educations, certifications] = await window.CVUploaderContract.viewAllCredentials(userAddress);

        // Function to map backend data to a comparable format
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

                    case 'softSkills':
                        return data.map(skill => ({
                            softID: skill.SoftID.toString(),
                            highlight: skill.SoftHighlight,
                            description: skill.SoftDescription,
                            level: skill.SoftLevel
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

                    
                case 'softSkills':
                    return data.map(skill => ({
                        softID: skill.softID.toString(),
                        highlight: skill.highlight,
                        description: skill.description,
                        level: skill.level
                    }));

                default:
                    return [];
            }
        }

        // Function to compare two data sets and find missing or different items
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

        // Function to create a display div for differences
        function createDifferenceDisplay(diff, type) {
            const diffDiv = document.createElement('div');
            diffDiv.className = 'info-card';
            let content = `<strong style="color:blue;">${diff.status} ${type}:</strong><br>`;

            // Display each property based on type
            for (const [key, value] of Object.entries(diff)) {
                if (key !== 'status') {
                    content += `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value || 'N/A'}<br>`;
                }
            }

            diffDiv.innerHTML = content;
            return diffDiv;
        }

        // Compare work experiences
        const mappedBackendWorks = mapBackendData(data.works, 'workExperiences');
        const mappedContractWorks = mapContractData(works, 'workExperiences');
        const workDifferences = compareData(mappedBackendWorks, mappedContractWorks, 'workExpID');

        // Display differences for work experiences
        const workContainer = document.getElementById('workDifferences');
        workDifferences.forEach(diff => {
            workContainer.appendChild(createDifferenceDisplay(diff, 'Work Experience Field'));
        });

        // Compare education
        const mappedBackendEducations = mapBackendData(data.educations, 'educations');
        const mappedContractEducations = mapContractData(educations, 'educations');
        const educationDifferences = compareData(mappedBackendEducations, mappedContractEducations, 'eduBadID');

        // Display differences for education
        const educationContainer = document.getElementById('educationDifferences');
        educationDifferences.forEach(diff => {
            educationContainer.appendChild(createDifferenceDisplay(diff, 'Education Field'));
        });

        // Compare certifications
        const mappedBackendCertifications = mapBackendData(data.certifications, 'certifications');
        const mappedContractCertifications = mapContractData(certifications, 'certifications');
        const certificationDifferences = compareData(mappedBackendCertifications, mappedContractCertifications, 'certID');

        // Display differences for certifications
        const certificationContainer = document.getElementById('certificationDifferences');
        certificationDifferences.forEach(diff => {
            certificationContainer.appendChild(createDifferenceDisplay(diff, 'Certification Field'));
        });

        // Compare soft skills
        const mappedBackendSkills = mapBackendData(data.softSkills, 'softSkills');
        const mappedContractSkills = mapContractData(softSkills, 'softSkills');
        const softSkillsDifferences = compareData(mappedBackendSkills, mappedContractSkills, 'softID');

        // Display differences for soft skills
        const softSkillsContainer = document.getElementById('softSkillsDifferences');
        softSkillsDifferences.forEach(diff => {
            softSkillsContainer.appendChild(createDifferenceDisplay(diff, 'Soft Skill Field'));
        });

        const hasWorkDifferences = document.getElementById('workDifferences').children.length > 0;
        const hasSoftSkillsDifferences = document.getElementById('softSkillsDifferences').children.length > 0;
        const hasEducationDifferences = document.getElementById('educationDifferences').children.length > 0;
        const hasCertificationDifferences = document.getElementById('certificationDifferences').children.length > 0;

        // If any section has differences, set `differences` to true
        const differences = hasWorkDifferences || hasSoftSkillsDifferences || hasEducationDifferences || hasCertificationDifferences;

        toggleDifferencesDisplay(differences);

    } catch (err) {
        console.error("Error fetching data:", err);
        document.getElementById('status').innerText = "Error fetching data.";
    }
}

function toggleDifferencesDisplay(hasDifferences) {
    const differencesHeader = document.querySelector('#differences h4'); // Select the <h4> tag

    if (hasDifferences) {
        // Show the header and update status
        differencesHeader.style.display = 'block';
    } else {
        // Hide the header and update status
        differencesHeader.style.display = 'none';
    }
}

