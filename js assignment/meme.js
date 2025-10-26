  var memeTemplates = [
            {
                id: 'drake',
                name: 'Drake Pointing',
                imageUrl: 'https://i.imgflip.com/30b1gx.jpg'
            },
            {
                id: 'distracted',
                name: 'Distracted Boyfriend',
                imageUrl: 'https://i.imgflip.com/1ur9b0.jpg'
            },
            {
                id: 'woman-cat',
                name: 'Woman Yelling at Cat',
                imageUrl: 'https://i.imgflip.com/345v97.jpg'
            },
            {
                id: 'expanding-brain',
                name: 'Expanding Brain',
                imageUrl: 'https://i.imgflip.com/1jwhww.jpg'
            },
            {
                id: 'this-is-fine',
                name: 'This is Fine',
                imageUrl: 'https://i.imgflip.com/26am.jpg'
            },
            {
                id: 'success-kid',
                name: 'Success Kid',
                imageUrl: 'https://i.imgflip.com/1bhk.jpg'
            },
            {
                id: 'two-buttons',
                name: 'Two Buttons',
                imageUrl: 'https://i.imgflip.com/1g8my4.jpg'
            },
            {
                id: 'change-my-mind',
                name: 'Change My Mind',
                imageUrl: 'https://i.imgflip.com/24y43o.jpg'
            }
        ];

        // Application state
        var currentMemes = [];
        var selectedTemplate = null;
        var editingMeme = null;
        var isLoading = false;
        var currentTextElements = [];
        var isAddingText = false;
        var nextTextId = 1;

        // Initialize the application
        function initApp() {
            renderTemplates();
            setupEventListeners();
            loadMemesFromStorage();
        }

        // Render meme templates
        function renderTemplates() {
            var grid = document.getElementById('templates-grid');
            var html = '';
            
            for (var i = 0; i < memeTemplates.length; i++) {
                var template = memeTemplates[i];
                html += '<div class="template-card" data-template-id="' + template.id + '">';
                html += '<img src="' + template.imageUrl + '" alt="' + template.name + '" class="template-image" onerror="this.src=\'\'; this.alt=\'Image failed to load\'; this.style.display=\'none\';">';
                html += '<h3><i class="bi bi-image"></i> ' + template.name + '</h3>';
                html += '</div>';
            }
            
            grid.innerHTML = html;
        }

        // Load memes from localStorage
        function loadMemesFromStorage() {
            var stored = localStorage.getItem('memeLabMemes');
            if (stored) {
                currentMemes = JSON.parse(stored);
            }
            renderMemes();
        }

        // Save memes to localStorage
        function saveMemesToStorage() {
            localStorage.setItem('memeLabMemes', JSON.stringify(currentMemes));
        }

        // Render user's memes
        function renderMemes() {
            var grid = document.getElementById('memes-grid');
            
            if (currentMemes.length === 0) {
                grid.innerHTML = '<div class="empty-state">' +
                    '<div class="empty-state-icon"><i class="bi bi-image" style="font-size: 3rem;"></i></div>' +
                    '<p>No memes created yet. Choose a template above to get started!</p>' +
                    '</div>';
                return;
            }

            var html = '';
            for (var i = 0; i < currentMemes.length; i++) {
                var meme = currentMemes[i];
                var template = null;
                
                // Find template
                for (var j = 0; j < memeTemplates.length; j++) {
                    if (memeTemplates[j].id === meme.template_id) {
                        template = memeTemplates[j];
                        break;
                    }
                }
                
                var textElements = JSON.parse(meme.text_elements || '[]');
                
                html += '<div class="meme-card">';
                html += '<div class="meme-container" style="position: relative; padding: 10px;">';
                
                if (template) {
                    html += '<img src="' + template.imageUrl + '" alt="' + template.name + '" style="width: 100%; height: auto; border-radius: 8px;" onerror="this.src=\'\'; this.alt=\'Image failed to load\';">';
                } else {
                    html += '<div style="width: 100%; height: 200px; background: #ddd; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #666;">Template not found</div>';
                }
                
                // Add text elements
                for (var k = 0; k < textElements.length; k++) {
                    var textEl = textElements[k];
                    html += '<div class="meme-text" style="left: ' + textEl.x + '%; top: ' + textEl.y + '%; font-size: ' + (textEl.fontSize || 20) + 'px;">';
                    html += textEl.text;
                    html += '</div>';
                }
                
                html += '</div>';
                html += '<div class="meme-card-actions">';
                html += '<button class="edit-meme-btn btn btn-secondary" data-meme-id="' + meme.id + '">';
                html += '<i class="bi bi-pencil"></i> Edit';
                html += '</button>';
                html += '<button class="delete-meme-btn btn btn-danger" data-meme-id="' + meme.id + '">';
                html += '<i class="bi bi-trash"></i> Delete';
                html += '</button>';
                html += '</div>';
                html += '</div>';
            }
            
            grid.innerHTML = html;
        }

        // Setup event listeners
        function setupEventListeners() {
            // Template selection
            document.getElementById('templates-grid').addEventListener('click', function(e) {
                var card = e.target.closest('.template-card');
                if (card) {
                    var templateId = card.getAttribute('data-template-id');
                    for (var i = 0; i < memeTemplates.length; i++) {
                        if (memeTemplates[i].id === templateId) {
                            selectedTemplate = memeTemplates[i];
                            break;
                        }
                    }
                    showCreateForm();
                }
            });

            // Create form events
            document.getElementById('create-btn').addEventListener('click', createMeme);
            document.getElementById('cancel-btn').addEventListener('click', hideCreateForm);
            document.getElementById('add-text-btn').addEventListener('click', toggleAddText);
            
            // Preview click for text positioning
            document.getElementById('preview-container').addEventListener('click', handlePreviewClick);

            // Edit and delete buttons
            document.getElementById('memes-grid').addEventListener('click', function(e) {
                var editBtn = e.target.closest('.edit-meme-btn');
                var deleteBtn = e.target.closest('.delete-meme-btn');
                
                if (editBtn) {
                    var memeId = editBtn.getAttribute('data-meme-id');
                    editMeme(memeId);
                } else if (deleteBtn) {
                    var memeId = deleteBtn.getAttribute('data-meme-id');
                    deleteMeme(memeId);
                }
            });

            // Edit modal events
            document.getElementById('save-edit-btn').addEventListener('click', saveEdit);
            document.getElementById('cancel-edit-btn').addEventListener('click', hideEditModal);
        }

        // Show create form
        function showCreateForm() {
            document.getElementById('create-form').classList.add('show');
            document.getElementById('meme-text').value = '';
            currentTextElements = [];
            isAddingText = false;
            updatePreview();
            updateTextElementsList();
            document.getElementById('meme-text').focus();
        }

        // Hide create form
        function hideCreateForm() {
            document.getElementById('create-form').classList.remove('show');
            selectedTemplate = null;
            currentTextElements = [];
            isAddingText = false;
        }

        // Toggle add text mode
        function toggleAddText() {
            var textInput = document.getElementById('meme-text');
            var text = textInput.value.trim();
            
            if (!text) {
                showMessage("Please enter some text first!", "error");
                return;
            }
            
            isAddingText = !isAddingText;
            var btn = document.getElementById('add-text-btn');
            
            if (isAddingText) {
                btn.innerHTML = '<i class="bi bi-bullseye"></i> Click on Image to Place Text';
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-orange');
                document.getElementById('preview-container').style.cursor = 'crosshair';
            } else {
                btn.innerHTML = '<i class="bi bi-cursor-text"></i> Add Text (Click on Image)';
                btn.classList.remove('btn-orange');
                btn.classList.add('btn-secondary');
                document.getElementById('preview-container').style.cursor = 'default';
            }
        }

        // Handle preview click for text positioning
        function handlePreviewClick(e) {
            if (!isAddingText) return;
            
            var textInput = document.getElementById('meme-text');
            var text = textInput.value.trim();
            
            if (!text) {
                showMessage("Please enter some text first!", "error");
                return;
            }
            
            var container = e.currentTarget;
            var rect = container.getBoundingClientRect();
            var img = container.querySelector('img');
            
            if (!img) return;
            
            var imgRect = img.getBoundingClientRect();
            var x = ((e.clientX - imgRect.left) / imgRect.width) * 100;
            var y = ((e.clientY - imgRect.top) / imgRect.height) * 100;
            
            // Add text element
            var textElement = {
                id: nextTextId++,
                text: text,
                x: Math.max(0, Math.min(100, x)),
                y: Math.max(0, Math.min(100, y)),
                fontSize: 20
            };
            
            currentTextElements.push(textElement);
            textInput.value = '';
            isAddingText = false;
            
            // Reset button
            var btn = document.getElementById('add-text-btn');
            btn.innerHTML = '<i class="bi bi-cursor-text"></i> Add Text (Click on Image)';
            btn.classList.remove('btn-orange');
            btn.classList.add('btn-secondary');
            container.style.cursor = 'default';
            
            updatePreview();
            updateTextElementsList();
        }

        // Update preview
        function updatePreview() {
            if (!selectedTemplate) return;
            
            var container = document.getElementById('preview-container');
            var html = '<img src="' + selectedTemplate.imageUrl + '" alt="' + selectedTemplate.name + '" style="width: 100%; height: auto; border-radius: 8px;" onerror="this.src=\'\'; this.alt=\'Image failed to load\';">';
            
            for (var i = 0; i < currentTextElements.length; i++) {
                var textEl = currentTextElements[i];
                html += '<div class="meme-text" style="left: ' + textEl.x + '%; top: ' + textEl.y + '%; font-size: ' + textEl.fontSize + 'px;">';
                html += textEl.text;
                html += '</div>';
            }
            
            container.innerHTML = html;
        }

        // Update text elements list
        function updateTextElementsList() {
            var list = document.getElementById('text-elements-list');
            
            if (currentTextElements.length === 0) {
                list.innerHTML = '<p class="help-text">No text elements added yet</p>';
                return;
            }
            
            var html = '';
            for (var i = 0; i < currentTextElements.length; i++) {
                var textEl = currentTextElements[i];
                html += '<div class="text-element-item">';
                html += '<span class="text-element-text">"' + textEl.text + '"</span>';
                html += '<button class="remove-btn" data-text-id="' + textEl.id + '">';
                html += '<i class="bi bi-x-circle"></i>';
                html += '</button>';
                html += '</div>';
            }
            
            list.innerHTML = html;
            
            // Add remove listeners
            var removeButtons = list.querySelectorAll('.remove-btn');
            for (var j = 0; j < removeButtons.length; j++) {
                removeButtons[j].addEventListener('click', function(e) {
                    var textId = parseInt(e.currentTarget.getAttribute('data-text-id'));
                    var newTextElements = [];
                    for (var k = 0; k < currentTextElements.length; k++) {
                        if (currentTextElements[k].id !== textId) {
                            newTextElements.push(currentTextElements[k]);
                        }
                    }
                    currentTextElements = newTextElements;
                    updatePreview();
                    updateTextElementsList();
                });
            }
        }

        // Create meme
        function createMeme() {
            if (!selectedTemplate || isLoading) return;

            if (currentTextElements.length === 0) {
                showMessage("Please add at least one text element to your meme.", "error");
                return;
            }

            setLoading(true);
            
            var memeData = {
                id: Date.now().toString(),
                template_id: selectedTemplate.id,
                text_elements: JSON.stringify(currentTextElements),
                created_at: new Date().toISOString()
            };

            currentMemes.push(memeData);
            saveMemesToStorage();
            renderMemes();
            hideCreateForm();
            showMessage("Meme created successfully!", "success");
            setLoading(false);
        }

        // Edit meme
        function editMeme(memeId) {
            editingMeme = null;
            for (var i = 0; i < currentMemes.length; i++) {
                if (currentMemes[i].id === memeId) {
                    editingMeme = currentMemes[i];
                    break;
                }
            }
            
            if (!editingMeme) return;
            
            var textElements = JSON.parse(editingMeme.text_elements || '[]');
            renderEditTextElements(textElements);
            
            document.getElementById('edit-modal').classList.add('show');
        }

        // Render edit text elements
        function renderEditTextElements(textElements) {
            var list = document.getElementById('edit-text-elements-list');
            
            if (textElements.length === 0) {
                list.innerHTML = '<p class="help-text">No text elements found</p>';
                return;
            }
            
            var html = '';
            for (var i = 0; i < textElements.length; i++) {
                var textEl = textElements[i];
                html += '<div class="edit-element-item">';
                html += '<input type="text" value="' + textEl.text + '" class="edit-text-input" data-index="' + i + '">';
                html += '<button class="remove-btn" data-index="' + i + '">';
                html += '<i class="bi bi-trash"></i>';
                html += '</button>';
                html += '</div>';
            }
            
            list.innerHTML = html;
            
            // Add event listeners for text editing
            var inputs = list.querySelectorAll('.edit-text-input');
            for (var j = 0; j < inputs.length; j++) {
                inputs[j].addEventListener('input', function(e) {
                    var index = parseInt(e.target.getAttribute('data-index'));
                    textElements[index].text = e.target.value;
                });
            }
            
            // Add event listeners for deletion
            var deleteButtons = list.querySelectorAll('.remove-btn');
            for (var k = 0; k < deleteButtons.length; k++) {
                deleteButtons[k].addEventListener('click', function(e) {
                    var index = parseInt(e.target.getAttribute('data-index'));
                    textElements.splice(index, 1);
                    renderEditTextElements(textElements);
                });
            }
        }

        // Save edit
        function saveEdit() {
            if (!editingMeme || isLoading) return;
            
            var list = document.getElementById('edit-text-elements-list');
            var inputs = list.querySelectorAll('.edit-text-input');
            var textElements = JSON.parse(editingMeme.text_elements || '[]');
            
            // Update text elements with new values
            for (var i = 0; i < inputs.length; i++) {
                var input = inputs[i];
                var index = parseInt(input.getAttribute('data-index'));
                if (textElements[index]) {
                    textElements[index].text = input.value.trim();
                }
            }
            
            // Filter out empty text elements
            var validTextElements = [];
            for (var j = 0; j < textElements.length; j++) {
                if (textElements[j].text.trim() !== '') {
                    validTextElements.push(textElements[j]);
                }
            }
            
            if (validTextElements.length === 0) {
                showMessage("Please keep at least one text element.", "error");
                return;
            }

            setLoading(true);
            
            // Update the meme in the array
            for (var k = 0; k < currentMemes.length; k++) {
                if (currentMemes[k].id === editingMeme.id) {
                    currentMemes[k].text_elements = JSON.stringify(validTextElements);
                    break;
                }
            }
            
            saveMemesToStorage();
            renderMemes();
            hideEditModal();
            showMessage("Meme updated successfully!", "success");
            setLoading(false);
        }

        // Delete meme
        function deleteMeme(memeId) {
            var memeIndex = -1;
            for (var i = 0; i < currentMemes.length; i++) {
                if (currentMemes[i].id === memeId) {
                    memeIndex = i;
                    break;
                }
            }
            
            if (memeIndex === -1 || isLoading) return;
            
            // Show inline confirmation
            var deleteBtn = document.querySelector('[data-meme-id="' + memeId + '"]');
            var originalText = deleteBtn.innerHTML;
            deleteBtn.innerHTML = '<i class="bi bi-question-circle"></i> Confirm Delete?';
            deleteBtn.style.backgroundColor = "#dc2626";
            
            var confirmDelete = function() {
                performDelete(memeIndex);
                cleanup();
            };
            
            var cancelDelete = function() {
                cleanup();
            };
            
            var cleanup = function() {
                deleteBtn.innerHTML = originalText;
                deleteBtn.style.backgroundColor = "";
                deleteBtn.removeEventListener('click', confirmDelete);
                document.removeEventListener('click', cancelDelete);
            };
            
            deleteBtn.addEventListener('click', confirmDelete);
            setTimeout(function() {
                document.addEventListener('click', cancelDelete);
            }, 100);
        }

        // Perform delete
        function performDelete(memeIndex) {
            setLoading(true);
            
            currentMemes.splice(memeIndex, 1);
            saveMemesToStorage();
            renderMemes();
            showMessage("Meme deleted successfully!", "success");
            setLoading(false);
        }

        // Hide edit modal
        function hideEditModal() {
            document.getElementById('edit-modal').classList.remove('show');
            editingMeme = null;
        }

        // Show message
        function showMessage(message, type) {
            var messageDiv = document.createElement('div');
            messageDiv.className = 'message ' + type;
            messageDiv.textContent = message;
            document.body.appendChild(messageDiv);
            
            setTimeout(function() {
                messageDiv.remove();
            }, 3000);
        }

        // Set loading state
        function setLoading(loading) {
            isLoading = loading;
            var buttons = document.querySelectorAll('button');
            for (var i = 0; i < buttons.length; i++) {
                var btn = buttons[i];
                if (loading) {
                    btn.classList.add('loading');
                    btn.disabled = true;
                } else {
                    btn.classList.remove('loading');
                    btn.disabled = false;
                }
            }
        }

        // Initialize app when DOM is ready
        document.addEventListener('DOMContentLoaded', initApp);