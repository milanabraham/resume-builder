document.getElementById('job-search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const searchQuery = document.getElementById('search-query').value;
    const employmentType = document.getElementById('employment-type').value;
    const jobResultsContainer = document.getElementById('job-results');
    const loadingIndicator = document.getElementById('loading');

    jobResultsContainer.innerHTML = '';
    loadingIndicator.style.display = 'block';

    const apiUrl = 'https://api.apijobs.dev/v1/job/search';
    // const apiKey = '7c02ca149365dbe3db2e7d580fbfcb6d926c77ae0df40d43bbcd002ab8d686c0';

    const payload = {
        q: searchQuery,
        employmentType: employmentType || undefined
    };

    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'apikey': apiKey,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        loadingIndicator.style.display = 'none';
        const jobResults = data.hits || [];

        if (jobResults.length === 0) {
            jobResultsContainer.innerHTML = '<p>No jobs found matching your criteria.</p>';
            return;
        }

        jobResults.slice(0, 12).forEach(job => {
            const jobCard = document.createElement('div');
            jobCard.classList.add('job-card');
            jobCard.innerHTML = `
                <h3>${job.title}</h3>
                <p class="company"><i class="fas fa-building"></i> ${job.website_name || 'Company Not Specified'}</p>
                <div class="details">
                    <p><i class="fas fa-map-marker-alt"></i> ${job.city || 'Location Not Specified'}</p>
                    <p><i class="fas fa-briefcase"></i> ${job.employment_type || 'Job Type'}</p>
                </div>
                <div class="details">
                    <a href="${job.url}" target="_blank" class="apply-btn">
                        Apply Now <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            `;
            jobResultsContainer.appendChild(jobCard);
        });
    })
    .catch(error => {
        loadingIndicator.style.display = 'none';
        console.error('Error fetching jobs:', error);
        jobResultsContainer.innerHTML = '<p>Unable to fetch job results. Please try again later.</p>';
    });
});