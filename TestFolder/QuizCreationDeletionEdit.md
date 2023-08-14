# Quiz Creation/Deletion/Edit Tests (3 points)
## Story: As a user I want to be able to create a quiz, delete a quiz, and edit a quiz.

### Test 1 (Create a quiz)
1. Go to the create quiz page
2. Type in desired number of questions
3. Type in desired questions and corresponding answers
4. Click create quiz
5. If user tries to create a quiz with less than 1 question, it will show an error message and the quiz will not be created.
6. Be redirected to the owned quiz page where it will populate the quizzes the user has created if successful

### Test 2 (Delete a quiz)
1. Go to the owned quizzes page
2. Click on a specific quiz you want to delete
3. Click the delete button
4. Be redirected to the owned quiz page where the quiz will no longer appear if deletion was successful

### Test 3 (Edit a quiz)
1. Go to the owned quizzes page
2. Click on a specific quiz you want to edit
3. Click the edit button
4. Type in the new edits to the question or answer or both
5. Be redirected to the owned quiz page where the quiz will have the changes added if edit was successful
