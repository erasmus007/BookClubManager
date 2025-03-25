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

    if (!title || !author) {
        alert('Please fill in both title and author');
        return;
    }

    const book = {
        id: Date.now(),
        title: title,
        author: author,
        readingDate: readingDate || 'TBD',
        status: 'planned'
    };

    bookClubData.books.push(book);
    saveBooks();
    displayBooks();
    clearBookForm();
    updateDiscussionBookOptions();
}

function displayBooks() {
    const bookItems = document.getElementById('book-items');
    bookItems.innerHTML = '';

    if (bookClubData.books.length === 0) {
        bookItems.innerHTML = `
            <div class="empty-state">
                <h3>No books yet</h3>
                <p>Add your first book to get started!</p>
            </div>
        `;
        return;
    }

    bookClubData.books.forEach(book => {
        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-item fade-in';
        bookDiv.innerHTML = `
            <h4>${book.title}</h4>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Reading Date:</strong> ${book.readingDate}</p>
            <p><strong>Status:</strong> ${book.status}</p>
        `;
        bookItems.appendChild(bookDiv);
    });
}

function clearBookForm() {
    document.getElementById('book-title').value = '';
    document.getElementById('book-author').value = '';
    document.getElementById('reading-date').value = '';
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