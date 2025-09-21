// Book Club Manager JavaScript

// Data structure for books
const bookClubData = {
    books: [],
    members: [],
    discussions: []
};

// Navigation handling
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('nav a');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    loadBooks();
    loadMembers();
    loadDiscussions();
    updateDiscussionBookOptions();
    setupSearchAndFilter();
    console.log('Book Club Manager initialized');
});

function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('section').forEach(section => {
        section.classList.remove('active-section');
        section.classList.add('hidden-section');
    });

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden-section');
        targetSection.classList.add('active-section');
    }
}

// Book management functions
function addBook() {
    const title = document.getElementById('book-title').value;
    const author = document.getElementById('book-author').value;
    const readingDate = document.getElementById('reading-date').value;
    const status = document.getElementById('book-status').value;
    const totalPages = parseInt(document.getElementById('book-pages').value) || 0;

    if (!title || !author) {
        alert('Please fill in both title and author');
        return;
    }

    const book = {
        id: Date.now(),
        title: title,
        author: author,
        readingDate: readingDate || 'TBD',
        status: status,
        rating: 0,
        dateAdded: new Date().toISOString().split('T')[0],
        totalPages: totalPages,
        currentPage: 0
    };

    bookClubData.books.push(book);
    saveBooks();
    displayBooks();
    clearBookForm();
    updateDiscussionBookOptions();
}

function displayBooks(filteredBooks = null) {
    const bookItems = document.getElementById('book-items');
    bookItems.innerHTML = '';

    const booksToShow = filteredBooks || bookClubData.books;

    if (booksToShow.length === 0) {
        const message = filteredBooks ? 'No books match your search criteria' : 'No books yet';
        const subMessage = filteredBooks ? 'Try adjusting your filters' : 'Add your first book to get started!';

        bookItems.innerHTML = `
            <div class="empty-state">
                <h3>${message}</h3>
                <p>${subMessage}</p>
            </div>
        `;
        return;
    }

    booksToShow.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-item fade-in';

        const ratingStars = generateStarRating(book.rating, book.id);
        const statusBadge = `<span class="status-badge ${book.status}">${book.status}</span>`;
        const progressHTML = generateProgressHTML(book);

        bookDiv.innerHTML = `
            <h4>${book.title}</h4>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Reading Date:</strong> ${book.readingDate}</p>
            <div class="book-rating">
                <strong>Rating:</strong> ${ratingStars}
            </div>
            <p><strong>Status:</strong> ${statusBadge}</p>
            ${progressHTML}
        `;
        bookItems.appendChild(bookDiv);
    });
}

function clearBookForm() {
    document.getElementById('book-title').value = '';
    document.getElementById('book-author').value = '';
    document.getElementById('reading-date').value = '';
    document.getElementById('book-status').value = 'planned';
    document.getElementById('book-pages').value = '';
}

function saveBooks() {
    localStorage.setItem('bookClubData', JSON.stringify(bookClubData));
}

function loadBooks() {
    const saved = localStorage.getItem('bookClubData');
    if (saved) {
        const data = JSON.parse(saved);
        bookClubData.books = data.books || [];
        displayBooks();
    }
}

// Member management functions
function addMember() {
    const name = document.getElementById('member-name').value;
    const email = document.getElementById('member-email').value;
    const role = document.getElementById('member-role').value;

    if (!name || !email) {
        alert('Please fill in both name and email');
        return;
    }

    // Simple email validation
    if (!email.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }

    const member = {
        id: Date.now(),
        name: name,
        email: email,
        role: role,
        joinDate: new Date().toISOString().split('T')[0]
    };

    bookClubData.members.push(member);
    saveMembers();
    displayMembers();
    clearMemberForm();
}

function displayMembers() {
    const memberItems = document.getElementById('member-items');
    memberItems.innerHTML = '';

    if (bookClubData.members.length === 0) {
        memberItems.innerHTML = `
            <div class="empty-state">
                <h3>No members yet</h3>
                <p>Add the first member to your book club!</p>
            </div>
        `;
        return;
    }

    bookClubData.members.forEach(member => {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'member-item fade-in';
        memberDiv.innerHTML = `
            <div class="member-info">
                <h4>${member.name}</h4>
                <p><strong>Email:</strong> ${member.email}</p>
                <p><strong>Joined:</strong> ${member.joinDate}</p>
            </div>
            <span class="member-role ${member.role}">${member.role}</span>
        `;
        memberItems.appendChild(memberDiv);
    });
}

function clearMemberForm() {
    document.getElementById('member-name').value = '';
    document.getElementById('member-email').value = '';
    document.getElementById('member-role').value = 'member';
}

function saveMembers() {
    localStorage.setItem('bookClubData', JSON.stringify(bookClubData));
}

function loadMembers() {
    const saved = localStorage.getItem('bookClubData');
    if (saved) {
        const data = JSON.parse(saved);
        bookClubData.members = data.members || [];
        displayMembers();
    }
}

// Discussion management functions
let currentDiscussionId = null;

function updateDiscussionBookOptions() {
    const select = document.getElementById('discussion-book');
    select.innerHTML = '<option value="">Select a book to discuss</option>';

    bookClubData.books.forEach(book => {
        const option = document.createElement('option');
        option.value = book.id;
        option.textContent = `${book.title} by ${book.author}`;
        select.appendChild(option);
    });
}

function startDiscussion() {
    const bookId = document.getElementById('discussion-book').value;
    if (!bookId) {
        alert('Please select a book first');
        return;
    }

    const book = bookClubData.books.find(b => b.id == bookId);
    if (!book) {
        alert('Book not found');
        return;
    }

    // Check if discussion already exists
    const existingDiscussion = bookClubData.discussions.find(d => d.bookId == bookId);
    if (existingDiscussion) {
        alert('Discussion for this book already exists');
        return;
    }

    const discussion = {
        id: Date.now(),
        bookId: parseInt(bookId),
        bookTitle: book.title,
        bookAuthor: book.author,
        createdDate: new Date().toISOString().split('T')[0],
        messages: []
    };

    bookClubData.discussions.push(discussion);
    saveDiscussions();
    displayDiscussions();
    document.getElementById('discussion-book').value = '';
}

function displayDiscussions() {
    const discussionItems = document.getElementById('discussion-items');
    discussionItems.innerHTML = '';

    if (bookClubData.discussions.length === 0) {
        discussionItems.innerHTML = `
            <div class="empty-state">
                <h3>No discussions yet</h3>
                <p>Start a discussion about a book to engage with other members!</p>
            </div>
        `;
        return;
    }

    bookClubData.discussions.forEach(discussion => {
        const discussionDiv = document.createElement('div');
        discussionDiv.className = 'discussion-item fade-in';
        discussionDiv.onclick = () => openDiscussion(discussion.id);
        discussionDiv.innerHTML = `
            <h4>${discussion.bookTitle}</h4>
            <p><strong>Author:</strong> ${discussion.bookAuthor}</p>
            <p><strong>Started:</strong> ${discussion.createdDate}</p>
            <p><strong>Messages:</strong> ${discussion.messages.length}</p>
        `;
        discussionItems.appendChild(discussionDiv);
    });
}

function openDiscussion(discussionId) {
    currentDiscussionId = discussionId;
    const discussion = bookClubData.discussions.find(d => d.id === discussionId);

    document.getElementById('discussions-list').style.display = 'none';
    document.getElementById('discussion-controls').style.display = 'none';
    document.getElementById('discussion-detail').classList.remove('hidden');

    document.getElementById('discussion-title').textContent =
        `Discussion: ${discussion.bookTitle} by ${discussion.bookAuthor}`;

    displayMessages(discussion.messages);
}

function closeDiscussion() {
    document.getElementById('discussions-list').style.display = 'block';
    document.getElementById('discussion-controls').style.display = 'flex';
    document.getElementById('discussion-detail').classList.add('hidden');
    currentDiscussionId = null;
}

function displayMessages(messages) {
    const messagesDiv = document.getElementById('discussion-messages');
    messagesDiv.innerHTML = '';

    messages.forEach(message => {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message';
        messageDiv.innerHTML = `
            <div class="message-author">
                ${message.author}
                <span class="message-time">${message.timestamp}</span>
            </div>
            <div>${message.content}</div>
        `;
        messagesDiv.appendChild(messageDiv);
    });
}

function addMessage() {
    const content = document.getElementById('new-message').value.trim();
    if (!content) {
        alert('Please enter a message');
        return;
    }

    if (!currentDiscussionId) {
        alert('No discussion selected');
        return;
    }

    const discussion = bookClubData.discussions.find(d => d.id === currentDiscussionId);
    if (!discussion) {
        alert('Discussion not found');
        return;
    }

    const message = {
        id: Date.now(),
        author: 'Current User', // In a real app, this would be the logged-in user
        content: content,
        timestamp: new Date().toLocaleString()
    };

    discussion.messages.push(message);
    saveDiscussions();
    displayMessages(discussion.messages);
    displayDiscussions(); // Update message count
    document.getElementById('new-message').value = '';
}

function saveDiscussions() {
    localStorage.setItem('bookClubData', JSON.stringify(bookClubData));
}

function loadDiscussions() {
    const saved = localStorage.getItem('bookClubData');
    if (saved) {
        const data = JSON.parse(saved);
        bookClubData.discussions = data.discussions || [];
        displayDiscussions();
    }
}

// Rating system functions
function generateStarRating(currentRating, bookId) {
    let stars = '<div class="rating-display">';
    for (let i = 1; i <= 5; i++) {
        const filled = i <= currentRating ? 'filled' : '';
        stars += `<span class="star ${filled}" onclick="rateBook(${bookId}, ${i})">★</span>`;
    }
    stars += '</div>';
    return stars;
}

function rateBook(bookId, rating) {
    const book = bookClubData.books.find(b => b.id === bookId);
    if (book) {
        book.rating = rating;
        saveBooks();
        applyFilters();
    }
}

// Search and filter functions
function setupSearchAndFilter() {
    const searchInput = document.getElementById('book-search');
    const statusFilter = document.getElementById('status-filter');
    const ratingFilter = document.getElementById('rating-filter');

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (statusFilter) statusFilter.addEventListener('change', applyFilters);
    if (ratingFilter) ratingFilter.addEventListener('change', applyFilters);
}

function applyFilters() {
    const searchTerm = document.getElementById('book-search')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('status-filter')?.value || '';
    const ratingFilter = document.getElementById('rating-filter')?.value || '';

    let filteredBooks = bookClubData.books.filter(book => {
        // Search filter
        const matchesSearch = !searchTerm ||
            book.title.toLowerCase().includes(searchTerm) ||
            book.author.toLowerCase().includes(searchTerm);

        // Status filter
        const matchesStatus = !statusFilter || book.status === statusFilter;

        // Rating filter
        let matchesRating = true;
        if (ratingFilter) {
            const minRating = parseInt(ratingFilter);
            matchesRating = book.rating >= minRating;
        }

        return matchesSearch && matchesStatus && matchesRating;
    });

    displayBooks(filteredBooks);
}

// Progress tracking functions
function generateProgressHTML(book) {
    if (!book.totalPages || book.totalPages <= 0) {
        return '';
    }

    const progressPercent = book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;

    return `
        <div class="progress-container">
            <strong>Reading Progress:</strong>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div class="progress-text">${book.currentPage || 0} / ${book.totalPages} pages (${progressPercent}%)</div>
            ${book.status === 'reading' ? `
                <div class="progress-update">
                    <span>Update progress:</span>
                    <input type="number" id="page-input-${book.id}" placeholder="Page" min="0" max="${book.totalPages}">
                    <button onclick="updateProgress(${book.id})">Update</button>
                </div>
            ` : ''}
        </div>
    `;
}

function updateProgress(bookId) {
    const book = bookClubData.books.find(b => b.id === bookId);
    const pageInput = document.getElementById(`page-input-${bookId}`);

    if (!book || !pageInput) return;

    const newPage = parseInt(pageInput.value);
    if (isNaN(newPage) || newPage < 0 || newPage > book.totalPages) {
        alert(`Please enter a valid page number between 0 and ${book.totalPages}`);
        return;
    }

    book.currentPage = newPage;

    // Auto-update status if completed
    if (newPage >= book.totalPages && book.status !== 'completed') {
        book.status = 'completed';
    }

    saveBooks();
    applyFilters();
    pageInput.value = '';
}