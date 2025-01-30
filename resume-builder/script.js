function resumeApp() {
    return {
        resumeData: {
            name: '',
            title: '',
            email: '',
            phone: '',
            location: '',
            website: '',
            summary: '',
            experiences: [],
            education: [],
            skills: [],
            projects: []
        },
        loadUserData() {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                alert('No user is logged in. Redirecting to login page.');
                window.location.href = '../index.html';
                return;
            }

            // Load user-specific data from localStorage
            const userData = JSON.parse(localStorage.getItem(`resumeData-${currentUser}`)) || {};
            Object.assign(this.resumeData, userData);
        },
        saveToLocalStorage() {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                // Save user-specific data to localStorage
                localStorage.setItem(`resumeData-${currentUser}`, JSON.stringify(this.resumeData));
            }
        },
        addItem(section) {
            this.resumeData[section].push({});
            this.saveToLocalStorage();
        },
        removeItem(section, index) {
            this.resumeData[section].splice(index, 1);
            this.saveToLocalStorage();
        },
        clearForm() {
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                localStorage.removeItem(`resumeData-${currentUser}`);
            }
            this.resumeData = {
                name: '',
                title: '',
                email: '',
                phone: '',
                location: '',
                website: '',
                summary: '',
                experiences: [],
                education: [],
                skills: [],
                projects: []
            };
        },
        init() {
            this.loadUserData(); 
        },
        downloadPDF() {
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Set initial coordinates
            let y = 20;
            const leftMargin = 20;
            const pageWidth = 190;
            const rightColumnStart = 110; // Starting x-position for right column

            // Helper functions
            const checkPageBreak = (requiredSpace = 10) => {
                if (y + requiredSpace > 280) {
                    doc.addPage();
                    y = 20;
                }
            };

            const addHeading = (text) => {
                checkPageBreak(15);
                doc.setFontSize(24);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(33, 33, 33);
                doc.text(text, leftMargin, y);
                y += 10;
            };

            const addSubHeading = (text) => {
                checkPageBreak(12);
                doc.setFontSize(16);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(255, 99, 71); // Coral color
                doc.text(text, leftMargin, y);
                y += 8;
            };

            const addSectionTitle = (text, xPos = leftMargin) => {
                checkPageBreak(15);
                doc.setFontSize(14);
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(33, 33, 33);
                doc.text(text.toUpperCase(), xPos, y);
                // Add underline
                doc.setLineWidth(0.5);
                doc.line(xPos, y + 1, xPos === leftMargin ? rightColumnStart - 10 : pageWidth, y + 1);
                y += 8;
            };

            const addBulletPoint = (text, xPos = leftMargin) => {
                checkPageBreak(8);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(33, 33, 33);
                const bulletPoint = '•';
                const indent = 5;
                const maxWidth = xPos === leftMargin ? rightColumnStart - leftMargin - 15 : pageWidth - rightColumnStart - 5;
                const lines = doc.splitTextToSize(text, maxWidth);
                doc.text(bulletPoint, xPos, y);
                doc.text(lines, xPos + indent, y);
                y += lines.length * 6;
            };

            const addContactInfo = (text, link = null) => {
                checkPageBreak(8);
                doc.setFontSize(10);
                doc.setFont('helvetica', 'normal');
                if (link) {
                    doc.setTextColor(0, 102, 204);
                    doc.textWithLink(text, leftMargin, y, { url: link });
                } else {
                    doc.setTextColor(33, 33, 33);
                    doc.text(text, leftMargin, y);
                }
                y += 6;
            };

            // Header
            addHeading(this.resumeData.name || 'Your Name');
            addSubHeading(this.resumeData.title || 'Your Title');
            y += 5;

            // Contact Information
            if (this.resumeData.email) addContactInfo(this.resumeData.email);
            if (this.resumeData.phone) addContactInfo(this.resumeData.phone);
            if (this.resumeData.location) addContactInfo(this.resumeData.location);
            if (this.resumeData.website) addContactInfo(this.resumeData.website, `https://${this.resumeData.website}`);
            y += 10;

            // Store initial y-position for right column
            const initialY = y;
            
            // Left Column
            // Work Experience
            addSectionTitle('WORK EXPERIENCE');
            this.resumeData.experiences.forEach(exp => {
                checkPageBreak(20);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text(exp.position || 'Position', leftMargin, y);
                y += 6;
                
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(255, 99, 71);
                doc.text(exp.company || 'Company', leftMargin, y);
                
                // Right-aligned date
                doc.setFontSize(9); // Smaller date
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(128, 128, 128);
                const dateText = `${exp.startYear || 'Start'} - ${exp.endYear || 'End'}`;
                const dateWidth = doc.getTextWidth(dateText);
                doc.text(dateText, rightColumnStart - 10 - dateWidth, y);
                y += 5;

                doc.setTextColor(255, 99, 71);
                doc.text(exp.company || 'Company', leftMargin, y);
                doc.text(exp.location || '', rightColumnStart - 10 - doc.getTextWidth(exp.location || ''), y);
                
                y += 6;
                
                if (exp.description) {
                    const descriptions = exp.description.split('\n');
                    descriptions.forEach(desc => {
                        addBulletPoint(desc);
                    });
                }
                y += 5;
            });

            // Reset y position for right column
            y = initialY;

            // Right Column
            // Education
            addSectionTitle('EDUCATION', rightColumnStart);
            this.resumeData.education.forEach(edu => {
                checkPageBreak(20);
                doc.setFontSize(12);
                doc.setFont('helvetica', 'bold');
                doc.text(edu.degree || 'Degree', rightColumnStart, y);
                y += 6;
                
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(255, 99, 71);
                doc.text(edu.school || 'School', rightColumnStart, y);
                
                // Right-aligned date
                doc.setFontSize(9);
                doc.setTextColor(128, 128, 128);
                const dateText = `${edu.startYear || 'Start'} - ${edu.endYear || 'End'}`;
                const dateWidth = doc.getTextWidth(dateText);
                doc.text(dateText, pageWidth - dateWidth + 5, y);
                y += 5;
            });

            // Skills
            if (this.resumeData.skills.length > 0) {
                addSectionTitle('SKILLS', rightColumnStart);
                this.resumeData.skills.forEach(skill => {
                    addBulletPoint(skill.name || '', rightColumnStart);
                });
                y += 5;
            }

            // Licenses
            if (this.resumeData.licenses && this.resumeData.licenses.length > 0) {
                addSectionTitle('LICENSES', rightColumnStart);
                this.resumeData.licenses.forEach(license => {
                    addBulletPoint(license.name || '', rightColumnStart);
                });
                y += 5;
            }

            // Projects
            if (this.resumeData.projects.length > 0) {
                addSectionTitle('PROJECTS', rightColumnStart);
                this.resumeData.projects.forEach(project => {
                    doc.setFontSize(11);
                    doc.setFont('helvetica', 'bold');
                    doc.text(project.name || 'Project Name', rightColumnStart, y);
                    y += 6;
                    if (project.description) {
                        addBulletPoint(project.description, rightColumnStart);
                    }
                    y += 5;
                });
            }

            // Activities
            if (this.resumeData.activities && this.resumeData.activities.length > 0) {
                addSectionTitle('ACTIVITIES', rightColumnStart);
                this.resumeData.activities.forEach(activity => {
                    addBulletPoint(activity.description || '', rightColumnStart);
                });
            }

            // Save the PDF
            doc.save(`${this.resumeData.name || "Resume"}.pdf`);
        }
    };
}
        
    