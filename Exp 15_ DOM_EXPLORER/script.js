/**
 * DOM EXPLORER – Dynamic Element Creator & DOM Traversal
 * Pure Vanilla JavaScript (No frameworks or dependencies)
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // 1. NAVIGATION & MOBILE MENU HANDLING
  // ==========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const appSidebar = document.getElementById('appSidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const navLinks = document.querySelectorAll('.nav-link');
  const contentSections = document.querySelectorAll('.content-section');

  // Toggle mobile sidebar
  function toggleMobileMenu() {
    const isOpen = appSidebar.classList.toggle('open');
    sidebarBackdrop.classList.toggle('active', isOpen);
  }

  function closeMobileMenu() {
    appSidebar.classList.remove('open');
    sidebarBackdrop.classList.remove('active');
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
  }
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileMenu);
  }

  // Active section indicator on scroll using IntersectionObserver
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  contentSections.forEach(section => {
    sectionObserver.observe(section);
  });

  // Close sidebar when clicking a nav link on mobile
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeMobileMenu();
      }
    });
  });


  // ==========================================================================
  // 2. DOM MANIPULATION PLAYGROUND (Dynamic Element Creator)
  // ==========================================================================
  const elementContentInput = document.getElementById('elementContentInput');
  const elementTypeSelect = document.getElementById('elementTypeSelect');
  const btnAddElement = document.getElementById('btnAddElement');
  const btnDeleteLast = document.getElementById('btnDeleteLast');
  const btnClearAll = document.getElementById('btnClearAll');
  const dynamicOutputContainer = document.getElementById('dynamicOutputContainer');
  const outputEmptyPlaceholder = document.getElementById('outputEmptyPlaceholder');
  const elementCountBadge = document.getElementById('elementCountBadge');
  const inputValidationError = document.getElementById('inputValidationError');
  const creatorFeedbackBanner = document.getElementById('creatorFeedbackBanner');
  const feedbackIcon = document.getElementById('feedbackIcon');
  const feedbackText = document.getElementById('feedbackText');
  const codeSnippetDisplay = document.getElementById('codeSnippetDisplay');

  let bannerTimeout = null;

  // Show status feedback banner
  function showFeedback(message, type = 'success') {
    if (bannerTimeout) clearTimeout(bannerTimeout);

    if (type === 'success') {
      feedbackIcon.textContent = '✅';
      creatorFeedbackBanner.style.background = 'var(--success-subtle)';
      creatorFeedbackBanner.style.borderColor = '#a7f3d0';
      creatorFeedbackBanner.style.color = '#065f46';
    } else if (type === 'warning') {
      feedbackIcon.textContent = '⚠️';
      creatorFeedbackBanner.style.background = 'var(--warning-subtle)';
      creatorFeedbackBanner.style.borderColor = '#fde68a';
      creatorFeedbackBanner.style.color = '#92400e';
    } else if (type === 'danger') {
      feedbackIcon.textContent = '🗑️';
      creatorFeedbackBanner.style.background = 'var(--danger-subtle)';
      creatorFeedbackBanner.style.borderColor = '#fecaca';
      creatorFeedbackBanner.style.color = '#991b1b';
    }

    feedbackText.textContent = message;
    creatorFeedbackBanner.style.display = 'flex';

    bannerTimeout = setTimeout(() => {
      creatorFeedbackBanner.style.display = 'none';
    }, 3800);
  }

  // Update element counter badge and toggle empty placeholder
  function updateElementCount() {
    // Count only actual created element items, ignoring the placeholder
    const createdItems = dynamicOutputContainer.querySelectorAll('.dom-created-item');
    const count = createdItems.length;
    elementCountBadge.textContent = count;

    if (count === 0) {
      if (outputEmptyPlaceholder) {
        outputEmptyPlaceholder.style.display = 'block';
      }
    } else {
      if (outputEmptyPlaceholder) {
        outputEmptyPlaceholder.style.display = 'none';
      }
    }
  }

  // Clear validation state when user types
  elementContentInput.addEventListener('input', () => {
    if (elementContentInput.value.trim() !== '') {
      elementContentInput.classList.remove('input-error');
      inputValidationError.style.display = 'none';
    }
  });

  // ADD ELEMENT using document.createElement(), textContent, appendChild()
  btnAddElement.addEventListener('click', () => {
    const rawContent = elementContentInput.value.trim();
    const selectedTag = elementTypeSelect.value;

    // Validation
    if (!rawContent) {
      elementContentInput.classList.add('input-error');
      inputValidationError.style.display = 'block';
      elementContentInput.focus();
      return;
    }

    // Hide any previous validation errors
    elementContentInput.classList.remove('input-error');
    inputValidationError.style.display = 'none';

    // 1. Create wrapper container for display and styling
    const wrapper = document.createElement('div');
    wrapper.className = `dom-created-item dom-item-${selectedTag}`;

    // 2. Create the chosen element dynamically
    const newElement = document.createElement(selectedTag);

    // 3. Set textContent safely (prevents XSS vulnerabilities)
    newElement.textContent = rawContent;

    // Custom formatting according to element type
    if (selectedTag === 'button') {
      newElement.className = 'dom-interactive-btn';
      newElement.addEventListener('click', () => {
        showFeedback(`Interactive button clicked: "${newElement.textContent}"`, 'warning');
      });
    } else {
      newElement.className = 'item-text';
    }

    // Create a tag badge to clearly show beginners which HTML tag was used
    const tagBadge = document.createElement('span');
    tagBadge.className = 'dom-tag-badge';
    tagBadge.textContent = `<${selectedTag}>`;

    // Append child nodes to wrapper
    wrapper.appendChild(newElement);
    wrapper.appendChild(tagBadge);

    // 4. Use appendChild() to inject into the live output container
    dynamicOutputContainer.appendChild(wrapper);

    // Update element count dynamically
    updateElementCount();

    // Show educational feedback & success alert
    showFeedback(`Created <${selectedTag}> with textContent and appended to container!`, 'success');

    // Update Live Code snippet box to show the exact JS code executed
    codeSnippetDisplay.textContent = 
`// 1. Create the new element
const newElement = document.createElement('${selectedTag}');

// 2. Set safe text content
newElement.textContent = "${rawContent}";

// 3. Append to output container
const container = document.getElementById('dynamicOutputContainer');
container.appendChild(newElement);`;

    // Smooth scroll to bottom of output container so user sees the new element immediately
    dynamicOutputContainer.scrollTop = dynamicOutputContainer.scrollHeight;

    // Reset input field and focus for rapid testing
    elementContentInput.value = '';
    elementContentInput.focus();
  });

  // DELETE LAST ELEMENT
  btnDeleteLast.addEventListener('click', () => {
    const createdItems = dynamicOutputContainer.querySelectorAll('.dom-created-item');
    if (createdItems.length === 0) {
      showFeedback('No elements to delete! The container is already empty.', 'warning');
      return;
    }

    // Target the last created item
    const lastItem = createdItems[createdItems.length - 1];
    const tag = lastItem.querySelector('.dom-tag-badge')?.textContent || 'element';
    
    // Remove element from DOM
    lastItem.remove();

    updateElementCount();
    showFeedback(`Deleted last element (${tag}) from the DOM!`, 'danger');

    // Update code snippet
    codeSnippetDisplay.textContent = 
`// Target and remove the last child element:
const container = document.getElementById('dynamicOutputContainer');
const lastElement = container.lastElementChild;

if (lastElement) {
  lastElement.remove(); // or container.removeChild(lastElement);
}`;
  });

  // CLEAR ALL ELEMENTS
  btnClearAll.addEventListener('click', () => {
    const createdItems = dynamicOutputContainer.querySelectorAll('.dom-created-item');
    if (createdItems.length === 0) {
      showFeedback('Container is already empty!', 'warning');
      return;
    }

    const removedCount = createdItems.length;

    // Remove each item
    createdItems.forEach(item => item.remove());

    updateElementCount();
    showFeedback(`Cleared all ${removedCount} elements from the DOM container!`, 'danger');

    // Update code snippet
    codeSnippetDisplay.textContent = 
`// Clear all children from container:
const container = document.getElementById('dynamicOutputContainer');
// Method A: Remove all children
while (container.firstChild) {
  container.removeChild(container.firstChild);
}`;
  });


  // ==========================================================================
  // 3. DOM TRAVERSAL EXPLORER
  // ==========================================================================
  const studentItems = document.querySelectorAll('.student-item');
  const btnHighlightParent = document.getElementById('btnHighlightParent');
  const btnHighlightSiblings = document.getElementById('btnHighlightSiblings');
  const btnResetHighlights = document.getElementById('btnResetHighlights');

  // Inspector elements
  const inspectorSelectedName = document.getElementById('inspectorSelectedName');
  const inspectorSelectedId = document.getElementById('inspectorSelectedId');
  const valParentElement = document.getElementById('valParentElement');
  const valChildren = document.getElementById('valChildren');
  const valFirstElementChild = document.getElementById('valFirstElementChild');
  const valPrevSibling = document.getElementById('valPrevSibling');
  const valNextSibling = document.getElementById('valNextSibling');
  const traversalInsightCode = document.getElementById('traversalInsightCode');

  let currentTargetStudent = document.getElementById('student1');

  // Function to remove all traversal highlights
  function clearAllHighlights() {
    const highlightedParents = document.querySelectorAll('.highlight-parent');
    highlightedParents.forEach(el => el.classList.remove('highlight-parent'));

    const highlightedSiblings = document.querySelectorAll('.highlight-sibling');
    highlightedSiblings.forEach(el => el.classList.remove('highlight-sibling'));
  }

  // Update Traversal Inspector details based on real DOM traversal
  function updateTraversalInspector(element) {
    if (!element) return;

    // Actual DOM Traversal API calls
    const parent = element.parentElement;
    const childrenList = element.children;
    const firstChild = element.firstElementChild;
    const prevSibling = element.previousElementSibling;
    const nextSibling = element.nextElementSibling;

    // Update selected student info
    inspectorSelectedName.textContent = element.dataset.name || element.id;
    inspectorSelectedId.textContent = `#${element.id}`;

    // 1. parentElement display
    if (parent) {
      valParentElement.innerHTML = `<span class="val-tag">&lt;${parent.tagName.toLowerCase()} id="${parent.id}"&gt;</span>`;
    } else {
      valParentElement.innerHTML = `<span class="val-null">null</span>`;
    }

    // 2. children count display
    valChildren.innerHTML = `<span class="val-number">${childrenList.length} child element${childrenList.length === 1 ? '' : 's'}</span>`;

    // 3. firstElementChild display
    if (firstChild) {
      const cls = firstChild.className ? `.${firstChild.className.split(' ')[0]}` : '';
      valFirstElementChild.innerHTML = `<span class="val-tag">&lt;${firstChild.tagName.toLowerCase()}${cls}&gt;</span>`;
    } else {
      valFirstElementChild.innerHTML = `<span class="val-null">null</span>`;
    }

    // 4. previousElementSibling display
    if (prevSibling && prevSibling.classList.contains('student-item')) {
      valPrevSibling.innerHTML = `<span class="val-tag">&lt;div id="${prevSibling.id}"&gt; (${prevSibling.dataset.name.split(':')[0]})</span>`;
    } else {
      valPrevSibling.innerHTML = `<span class="val-null">null (First sibling)</span>`;
    }

    // 5. nextElementSibling display
    if (nextSibling && nextSibling.classList.contains('student-item')) {
      valNextSibling.innerHTML = `<span class="val-tag">&lt;div id="${nextSibling.id}"&gt; (${nextSibling.dataset.name.split(':')[0]})</span>`;
    } else {
      valNextSibling.innerHTML = `<span class="val-null">null (Last sibling)</span>`;
    }

    // Update JS code preview
    const prevCodeVal = prevSibling && prevSibling.classList.contains('student-item') 
      ? `document.getElementById("${prevSibling.id}")` 
      : 'null';
    const nextCodeVal = nextSibling && nextSibling.classList.contains('student-item') 
      ? `document.getElementById("${nextSibling.id}")` 
      : 'null';

    traversalInsightCode.textContent = 
`// Currently selected element:
const current = document.getElementById("${element.id}");

// 1. parentElement:
const parent = current.parentElement;
// Result: <div id="${parent ? parent.id : 'null'}">

// 2. children:
const children = current.children; // length: ${childrenList.length}

// 3. firstElementChild:
const first = current.firstElementChild; // <${firstChild ? firstChild.tagName.toLowerCase() : 'none'}>

// 4. previousElementSibling:
const prev = current.previousElementSibling; // ${prevCodeVal}

// 5. nextElementSibling:
const next = current.nextElementSibling; // ${nextCodeVal}`;
  }

  // Handle student selection click
  studentItems.forEach(student => {
    student.addEventListener('click', (e) => {
      // Clear selection styling
      studentItems.forEach(s => {
        s.classList.remove('active-target');
        const badge = s.querySelector('.select-badge');
        if (badge) badge.textContent = 'Select';
      });

      // Clear any prior highlights
      clearAllHighlights();

      // Set new active student
      currentTargetStudent = student;
      student.classList.add('active-target');
      const badge = student.querySelector('.select-badge');
      if (badge) badge.textContent = 'Selected';

      // Update inspector
      updateTraversalInspector(student);
    });
  });

  // Initial inspector setup for default student 1
  if (currentTargetStudent) {
    updateTraversalInspector(currentTargetStudent);
  }

  // Highlight Parent button
  btnHighlightParent.addEventListener('click', () => {
    if (!currentTargetStudent) return;
    clearAllHighlights();

    // DOM Traversal: access parentElement
    const parent = currentTargetStudent.parentElement;
    if (parent) {
      parent.classList.add('highlight-parent');
    }
  });

  // Highlight Siblings button
  btnHighlightSiblings.addEventListener('click', () => {
    if (!currentTargetStudent) return;
    clearAllHighlights();

    // Traverse all siblings using parent.children or sibling pointers
    const parent = currentTargetStudent.parentElement;
    if (parent) {
      const allChildren = parent.children;
      for (let i = 0; i < allChildren.length; i++) {
        const sibling = allChildren[i];
        // Don't highlight the active student itself as a sibling
        if (sibling !== currentTargetStudent && sibling.classList.contains('student-item')) {
          sibling.classList.add('highlight-sibling');
        }
      }
    }
  });

  // Reset Highlights button
  btnResetHighlights.addEventListener('click', () => {
    clearAllHighlights();
  });


  // ==========================================================================
  // 4. INTERACTIVE DOM TREE
  // ==========================================================================
  const treeNodes = document.querySelectorAll('.dom-tree-node');
  const treeInspectorName = document.getElementById('treeInspectorName');
  const treeInspectorTag = document.getElementById('treeInspectorTag');
  const treeInspectorChildren = document.getElementById('treeInspectorChildren');
  const treeInspectorParent = document.getElementById('treeInspectorParent');
  const treeInspectorSiblings = document.getElementById('treeInspectorSiblings');
  const treeCodeSyntax = document.getElementById('treeCodeSyntax');

  treeNodes.forEach(node => {
    node.addEventListener('click', () => {
      // Remove selected class from all tree nodes
      treeNodes.forEach(n => n.classList.remove('node-selected'));

      // Add selected class to clicked node
      node.classList.add('node-selected');

      const tagName = node.dataset.tag || 'ELEMENT';
      const nodeName = node.dataset.name || 'node';
      const parentName = node.dataset.parent || 'null';
      const childCount = node.dataset.children || '0';

      // Update Inspector Panel
      treeInspectorName.textContent = `<${nodeName}>`;
      treeInspectorTag.textContent = tagName;
      treeInspectorChildren.textContent = `${childCount} child element${childCount === '1' ? '' : 's'}`;

      if (parentName !== 'null') {
        treeInspectorParent.innerHTML = `<code>&lt;${parentName}&gt;</code>`;
      } else {
        treeInspectorParent.innerHTML = `<span class="val-null">null (Top-level Document)</span>`;
      }

      // Check siblings by traversing tree level
      const parentSubBranch = node.closest('.tree-sub-branch') || node.closest('.tree-row');
      let siblingText = 'None (Unique child)';
      if (node.previousElementSibling && node.previousElementSibling.classList.contains('dom-tree-node')) {
        siblingText = `Has previous sibling: <${node.previousElementSibling.dataset.name}>`;
      } else if (node.nextElementSibling && node.nextElementSibling.classList.contains('dom-tree-node')) {
        siblingText = `Has next sibling: <${node.nextElementSibling.dataset.name}>`;
      } else if (nodeName === 'body') {
        siblingText = 'Sibling: <head>';
      } else if (nodeName === 'head') {
        siblingText = 'Sibling: <body>';
      } else if (nodeName === 'header') {
        siblingText = 'Siblings: <main>, <footer>';
      } else if (nodeName === 'footer') {
        siblingText = 'Siblings: <header>, <main>';
      } else if (nodeName === 'section') {
        siblingText = 'Sibling: <container>';
      }

      treeInspectorSiblings.textContent = siblingText;

      // Update code syntax display
      treeCodeSyntax.textContent = 
`// Inspecting <${nodeName}> element:
const node = document.querySelector('${nodeName === "document" ? "html" : nodeName}');
console.log(node.tagName);               // "${tagName}"
console.log(node.parentElement);         // ${parentName === "null" ? "null" : `<${parentName}>`}
console.log(node.children.length);       // ${childCount}`;
    });
  });


  // ==========================================================================
  // 5. REAL-WORLD EXAMPLE: STUDENT STATUS TOGGLE WITH closest() & querySelector()
  // ==========================================================================
  const btnStatusToggles = document.querySelectorAll('.btn-status-toggle');
  const traceLogContent = document.getElementById('traceLogContent');
  const traceStatusBadge = document.getElementById('traceStatusBadge');

  btnStatusToggles.forEach(button => {
    button.addEventListener('click', (e) => {
      // 1. Identify the clicked button (e.currentTarget)
      const clickedBtn = e.currentTarget;

      // 2. Use closest() to traverse UP from the button to the enclosing student card
      const studentCard = clickedBtn.closest('.student-mgmt-card');

      if (!studentCard) return;

      // 3. Use querySelector() to search DOWN only within this specific student card
      const statusBadge = studentCard.querySelector('.status-badge');
      const studentNameEl = studentCard.querySelector('.student-mgmt-name');
      const studentName = studentNameEl ? studentNameEl.textContent : 'Student';
      const cardId = studentCard.id;

      // Toggle status between "Active" and "Completed"
      const currentStatus = statusBadge.textContent.trim();
      let newStatus = '';

      if (currentStatus === 'Active') {
        newStatus = 'Completed';
        statusBadge.textContent = 'Completed';
        statusBadge.className = 'status-badge status-completed';
      } else {
        newStatus = 'Active';
        statusBadge.textContent = 'Active';
        statusBadge.className = 'status-badge status-active';
      }

      // Add a visual flash pulse to this specific card only
      studentCard.classList.remove('card-targeted');
      void studentCard.offsetWidth; // Trigger reflow to restart animation
      studentCard.classList.add('card-targeted');

      // Update trace status badge
      traceStatusBadge.textContent = `Updated: ${studentName}`;
      traceStatusBadge.style.color = '#34d399';

      // Render step-by-step educational trace log
      traceLogContent.innerHTML = `
        <div class="trace-step">
          <span class="step-num">Step 1:</span>
          <span class="step-desc">Event triggered by click on <code>&lt;button class="btn-status-toggle"&gt;</code></span>
        </div>
        <div class="trace-step">
          <span class="step-num">Step 2:</span>
          <span class="step-desc"><code>e.target.closest('.student-mgmt-card')</code> located ancestor <code>#${cardId}</code></span>
        </div>
        <div class="trace-step">
          <span class="step-num">Step 3:</span>
          <span class="step-desc">Scoped <code>card.querySelector('.status-badge')</code> isolated this card's badge</span>
        </div>
        <div class="trace-step">
          <span class="step-num">Step 4:</span>
          <span class="step-desc">Status toggled from <strong>"${currentStatus}"</strong> &rarr; <strong style="color: ${newStatus === 'Active' ? '#10b981' : '#8b5cf6'}">"${newStatus}"</strong> for <strong>${studentName}</strong> (Other cards remained untouched)</span>
        </div>
      `;
    });
  });

});
