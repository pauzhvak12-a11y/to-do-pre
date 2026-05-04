let items = [
	"Сделать проектную работу",
	"Полить цветы",
	"Пройти туториал по Реакту",
	"Сделать фронт для своего проекта",
	"Прогуляться по улице в солнечный день",
	"Помыть посуду",
];

const listElement = document.querySelector(".to-do__list");
const formElement = document.querySelector(".to-do__form");
const inputElement = document.querySelector(".to-do__input");

function loadTasks() {
	// Проверяем, есть ли сохранённые задачи в локальном хранилище
	const savedTasks = localStorage.getItem("tasks");
	if (savedTasks) {
		return JSON.parse(savedTasks);
	}
	// Если нет, возвращаем массив по умолчанию
	return items;
}

function createItem(item) {
	const template = document.getElementById("to-do__item-template");
	const clone = template.content.querySelector(".to-do__item").cloneNode(true);
	const textElement = clone.querySelector(".to-do__item-text");
	const deleteButton = clone.querySelector(".to-do__item-button_type_delete");
	const duplicateButton = clone.querySelector(".to-do__item-button_type_duplicate");
	const editButton = clone.querySelector(".to-do__item-button_type_edit");
	
	// Устанавливаем текст задачи
	textElement.textContent = item;
	
	// Обработчик удаления задачи
	deleteButton.addEventListener("click", () => {
		clone.remove();
		const tasks = getTasksFromDOM();
		saveTasks(tasks);
	});
	
	// Обработчик копирования задачи
	duplicateButton.addEventListener("click", () => {
		const itemName = textElement.textContent;
		const newItem = createItem(itemName);
		listElement.prepend(newItem);
		const tasks = getTasksFromDOM();
		saveTasks(tasks);
	});
	
	// Дополнительное задание: обработчик редактирования задачи
	editButton.addEventListener("click", () => {
		textElement.contentEditable = "true";
		textElement.focus();
	});
	
	textElement.addEventListener("blur", () => {
		textElement.contentEditable = "false";
		const tasks = getTasksFromDOM();
		saveTasks(tasks);
	});
	
	return clone;
}

function getTasksFromDOM() {
	// Находим все элементы с текстом задач
	const itemsNamesElements = document.querySelectorAll(".to-do__item-text");
	const tasks = [];
	
	// Проходим по каждому элементу и добавляем текст в массив
	itemsNamesElements.forEach(element => {
		tasks.push(element.textContent);
	});
	
	return tasks;
}

function saveTasks(tasks) {
	// Сохраняем массив задач в локальное хранилище
	localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Загрузка задач при старте
items = loadTasks();

// Отображение всех задач
items.forEach(item => {
	listElement.append(createItem(item));
});

// Обработчик отправки формы
formElement.addEventListener("submit", (event) => {
	// Отключаем перезагрузку страницы
	event.preventDefault();
	
	// Получаем текст из поля ввода
	const newTaskText = inputElement.value;
	
	// Проверяем, что поле не пустое (опционально, но полезно)
	if (newTaskText.trim() === "") {
		return;
	}
	
	// Создаём новую задачу и добавляем в начало списка
	const newTask = createItem(newTaskText);
	listElement.prepend(newTask);
	
	// Обновляем и сохраняем список задач
	items = getTasksFromDOM();
	saveTasks(items);
	
	// Очищаем поле ввода
	inputElement.value = "";
});