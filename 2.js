/**
 * Создает экземпляр космического корабля.
 * @name Vessel
 * @param {String} name Название корабля.
 * @param {Number}[] position Местоположение корабля.
 * @param {Number} capacity Грузоподъемность корабля.
 * @return Boolean|{object} экземпляр космического корабля
 */
function Vessel(name, position, capacity) {

	// Если координаты переданы но не в виде массива
	if (typeof position != "undefined" && typeof position != "object") {
		throw('Неправильно заданы начальные координаты корабля!');
		return false;
	}

	this.name = (typeof name != "undefined") ? name : '';
	this.position = (typeof position != "undefined") ? position : [0,0];	// Если координаты не заданы - ставим по умолчанию [0,0]
	this.capacity = (typeof capacity != "undefined") ? capacity : 1000;		// Если грузоподъёмность не задана - ставим по умолчанию 1000т.

	this.cargo = 0; 		// Количество груза на борту
	this.planetName = '';	// Название текущей планеты пребывания

	return this;
}

/**
 * Выводит текущее состояние корабля: имя, местоположение, доступную грузоподъемность.
 * @example
 * vessel.report(); // Грузовой корабль. Местоположение: Земля. Товаров нет.
 * @example
 * vessel.report(); // Грузовой корабль. Местоположение: 50,20. Груз: 200т.
 * @name Vessel.report
 * @return {String}
 */
Vessel.prototype.report = function () {

	var name = (this.name == '') ? 'Грузовой корабль' : 'Корабль "'+this.name+'"';
	var position = (this.planetName  == '') ? this.position.join(',') : this.planetName;
	var cargo = 'Занято '+this.cargo+' из '+this.capacity+'т';

	var result = name+'. Местоположение: '+position+'. '+cargo+'.';

	return result;
}

/**
 * Выводит количество свободного места на корабле.
 * @name Vessel.getFreeSpace
 * @return {Number} 
 */
Vessel.prototype.getFreeSpace = function () {
	return this.capacity - this.cargo;
}

/**
 * Выводит количество занятого места на корабле.
 * @name Vessel.getOccupiedSpace
 * @return {Number}  
 */
Vessel.prototype.getOccupiedSpace = function () {
	return this.cargo;
}

/**
 * Переносит корабль в указанную точку.
 * @param {Number}[]|Planet newPosition Новое местоположение корабля.
 * @example
 * vessel.flyTo([1,1]);
 * @example
 * var earth = new Planet('Земля', [1,1]);
 * vessel.flyTo(earth);
 * @name Vessel.report
 * @return Boolean|{Number}[] Новые координаты корабля 
 */
Vessel.prototype.flyTo = function (newPosition) {

	// Если newPosition не массив координат и не объект планеты
	if (typeof newPosition != 'object') {
		throw('Неправильно указан пункт назначения!');
		return false;
	} else {

		// Если newPosition планета
		if (newPosition instanceof Planet) {

			this.position = newPosition.position;
			this.planetName = newPosition.name;

		// Если newPosition массив координат
		} else {
			if (newPosition.length == 2) {
				this.position = newPosition;
				this.planetName = '';
			}
		}

		return this.position;
	}
}

/**
 * Создает экземпляр планеты.
 * @name Planet
 * @param {String} name Название Планеты.
 * @param {Number}[] position Местоположение планеты.
 * @param {Number} availableAmountOfCargo Доступное количество груза.
 * @return Boolean|{object} экземпляр планеты
 */
function Planet(name, position, availableAmountOfCargo) {

	// Если координаты переданы но не в виде массива
	if (typeof position != "undefined" && typeof position != "object") {
		throw('Неправильно заданы координаты планеты "'+name+'"!');
		return false;
	}

	this.name = name;
	this.position = (typeof position != "undefined") ? position : [0,0];	// Если координаты не заданы - ставим по умолчанию [0,0]
	this.availableAmountOfCargo = (typeof availableAmountOfCargo != "undefined") ? availableAmountOfCargo : 0; // Если доступное количество груза не указано - ставим по умолчанию, что груза нет

	return this;
}

/**
 * Выводит текущее состояние планеты: имя, местоположение, количество доступного груза.
 * @name Planet.report
 * @return {String}
 */
Planet.prototype.report = function () {

	var availableAmountOfCargo = (this.availableAmountOfCargo > 0) ? 'Доступно груза: '+this.availableAmountOfCargo+'т' : 'Грузов нет';
	var position = this.position.join(',');

	var result = 'Планета "'+this.name+'". Местоположение: '+position+'. '+availableAmountOfCargo+'.';

	return result;
}

/**
 * Возвращает доступное количество груза планеты.
 * @name Vessel.getAvailableAmountOfCargo
 * @return {Number}
 */
Planet.prototype.getAvailableAmountOfCargo = function () {
	return this.availableAmountOfCargo;
}

/**
 * Загружает на корабль заданное количество груза.
 * 
 * Перед загрузкой корабль должен приземлиться на планету.
 * @param {Vessel} vessel Загружаемый корабль.
 * @param {Number} cargoWeight Вес загружаемого груза.
 * @name Vessel.loadCargoTo
 * @return Boolean|{String} состояние планеты после загрузки корабля
 */
Planet.prototype.loadCargoTo = function (vessel, cargoWeight) {

	// Если не указано количество груза
	if (typeof cargoWeight == "undefined") {
		throw('Не указано количество груза для загрузки на корабль!');
		return false;
	}		

	// Если переменная vessel не является объектом или экземпляром кораблы
	if (typeof vessel != 'object' || !(vessel instanceof Vessel)) {
		throw('Неверно указан корабль для загрузки!');
		return false;
	}

	// Если корабль ещё не приземлился на планету
	if (vessel.planetName != this.name) {
		throw('Корабль ещё не приземлился на планету!');
		return false;
	}

	// Если на корабле недостаточно свободного места
	if (vessel.getFreeSpace() < cargoWeight) {
		throw('На корабле недостаточно свободного места!');
		return false;
	}	

	// Если на планете недостаточно груза
	if (this.availableAmountOfCargo < cargoWeight) {
		throw('На планете недостаточно груза!');
		return false;
	}		

	vessel.cargo += cargoWeight;

	this.availableAmountOfCargo -= cargoWeight;

	return this.report();
}

/**
 * Выгружает с корабля заданное количество груза.
 * 
 * Перед выгрузкой корабль должен приземлиться на планету.
 * @param {Vessel} vessel Разгружаемый корабль.
 * @param {Number} cargoWeight Вес выгружаемого груза.
 * @name Vessel.unloadCargoFrom
 * @return Boolean|{String} состояние планеты после разгрузки корабля
 */
Planet.prototype.unloadCargoFrom = function (vessel, cargoWeight) {

	// Если не указано количество груза
	if (typeof cargoWeight == "undefined") {
		throw('Не указано количество груза для выгрузки с корабля!');
		return false;
	}		

	// Если переменная vessel не является объектом или экземпляром кораблы
	if (typeof vessel != 'object' || !(vessel instanceof Vessel)) {
		throw('Неверно указан корабль для разгрузки!');
		return false;
	}

	// Если корабль ещё не приземлился на планету
	if (vessel.planetName != this.name) {
		throw('Корабль ещё не приземлился на планету!');
		return false;
	}

	// Если на корабле недостаточно свободного места
	if (vessel.getOccupiedSpace() < cargoWeight) {
		throw('На корабле недостаточно груза!');
		return false;
	}	

	vessel.cargo -= cargoWeight;

	this.availableAmountOfCargo += cargoWeight;

	return this.report();
}
