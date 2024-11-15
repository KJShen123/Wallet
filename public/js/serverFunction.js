async function fetchUserData() {
    try {
        // Make a GET request to the backend route
        const response = await fetch('/getUserData');

        if (!response.ok) {
            throw new Error("Failed to fetch data");
        }

        const data = await response.json();

        // Display certifications
        const userContainer = document.getElementById('user');
        data.user.forEach(user => {
            const userDiv = document.createElement('div');
            userDiv.className = 'question-text';
            userDiv.innerHTML = `
                <strong>Name:</strong> ${user.Name} <br>
                <strong>Email:</strong> ${user.Email_Address} <br> 
                <strong>Age:</strong> ${user.Age} <br> `;
                userContainer.appendChild(userDiv);
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
                <strong>Active:</strong> ${cert.Active ? "Yes" : "No"}`;
            certContainer.appendChild(certDiv);
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
                <strong>End Date:</strong> ${edu.EduEndDate}`;
            eduContainer.appendChild(eduDiv);
        });

        // Display soft skills
        const skillContainer = document.getElementById('softSkills');
        data.softSkills.forEach(skill => {
            const skillDiv = document.createElement('div');
            skillDiv.className = 'question-text';
            skillDiv.innerHTML = `
                <strong>Soft Skill:</strong> ${skill.SoftHighlight} <br> 
                <strong>Description:</strong> ${skill.SoftDescription} <br> 
                <strong>Level:</strong> ${skill.SoftLevel}`;
            skillContainer.appendChild(skillDiv);
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
                <strong>End Date:</strong> ${work.WorkEndDate}`;
            workContainer.appendChild(workDiv);
        });
    } catch (err) {
        console.error("Error fetching user data:", err);
    }
}