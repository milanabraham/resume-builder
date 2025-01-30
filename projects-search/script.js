document.getElementById('resume-upload-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const fileInput = document.getElementById('resume-file');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const resumeText = e.target.result;

            // Extract skills and job titles from the resume
            const skills = extractSkills(resumeText);
            const jobTitles = extractJobTitles(resumeText);

            // Get project recommendations based on the extracted skills
            fetchProjectRecommendations(skills, jobTitles);
        };
        reader.readAsText(file);
    }
});

document.getElementById('search-btn').addEventListener('click', function() {
    const searchKeywords = document.getElementById('manual-search').value.trim();

    if (searchKeywords) {
        // Get project recommendations based on the manual search keywords
        fetchManualSearchRecommendations(searchKeywords);
    } else {
        alert('Please enter search keywords.');
    }
});

function extractSkills(resumeText) {
    const skillsList = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'Django'];  // Example skills list
    const skillsFound = skillsList.filter(skill => resumeText.includes(skill));
    return skillsFound;
}

function extractJobTitles(resumeText) {
    const jobTitles = ['Software Engineer', 'Web Developer', 'Data Scientist', 'Full-stack Developer'];  // Example titles
    const foundTitles = jobTitles.filter(title => resumeText.includes(title));
    return foundTitles;
}

function fetchProjectRecommendations(skills, jobTitles) {
    const query = [...skills, ...jobTitles].join('+');

    // Example API URL for GitHub search
    const apiUrl = `https://api.github.com/search/repositories?q=${query}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const projects = data.items || [];
            displayProjects(projects);
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
            alert('An error occurred while fetching project recommendations.');
        });
}

function fetchManualSearchRecommendations(keywords) {
    // Use the search keywords to fetch relevant GitHub projects
    const apiUrl = `https://api.github.com/search/repositories?q=${keywords}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const projects = data.items || [];
            displayProjects(projects);
        })
        .catch(error => {
            console.error('Error fetching projects:', error);
            alert('An error occurred while fetching project recommendations.');
        });
}

function displayProjects(projects) {
    const projectContainer = document.getElementById('project-recommendations');
    projectContainer.innerHTML = ''; 

    if (projects.length === 0) {
        projectContainer.innerHTML = '<div class="project">No relevant projects found.</div>';
        return;
    }

    projects.slice(0, 9).forEach(project => {
        const projectElement = document.createElement('div');
        projectElement.classList.add('project');
        projectElement.innerHTML = `
            <h3><a href="${project.html_url}" target="_blank">${project.name}</a></h3>
            <p>${project.description || 'No description available'}</p>
            <p><strong>Language:</strong> ${project.language || 'N/A'}</p>
            <p><strong>Stars:</strong> ${project.stargazers_count}</p>
        `;
        projectContainer.appendChild(projectElement);
    });
}


