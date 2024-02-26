let questionCount = 0;

function addQuestion() {
  questionCount++;
  const container = document.getElementById("questionsContainer");
  const questionDiv = document.createElement("div");
  questionDiv.innerHTML = `
    <div>
      <label for="question${questionCount}">Question ${questionCount}:</label><br>
      <input type="text" id="question${questionCount}" name="questions[${
    questionCount - 1
  }][questionText]" placeholder="Enter your question" required><br>
      
      <input type="text" id="option${questionCount}1" name="questions[${
    questionCount - 1
  }][options][0]" placeholder="Option A" required>
      
      <input type="text" id="option${questionCount}2" name="questions[${
    questionCount - 1
  }][options][1]" placeholder="Option B" required>
      
      <input type="text" id="option${questionCount}3" name="questions[${
    questionCount - 1
  }][options][2]" placeholder="Option C">
      
      <input type="text" id="option${questionCount}4" name="questions[${
    questionCount - 1
  }][options][3]" placeholder="Option D">
      <label for="correctOption${questionCount}">Correct Option:</label>
      <select id="correctOption${questionCount}" name="questions[${
    questionCount - 1
  }][correctOption]" required>
        <option value="0">Option A</option>
        <option value="1">Option B</option>
        <option value="2">Option C</option>
        <option value="3">Option D</option>
      </select><br><br>
    </div>
  `;
  container.appendChild(questionDiv);
}




