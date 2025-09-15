Feature: IMC Controller
    Como usuario de la API
    Quiero calcular mi IMC y consultar el historial
    Para poder llevar un seguimiento de mi salud

    Scenario: Calcular IMC con datos válidos
        Given un usuario envía peso 70kg y altura 1.75m
        When el controlador procesa la solicitud
        Then se devuelve un IMC de 22.86 y la categoría "Normal"

    Scenario: Calcular IMC con datos inválidos
        Given un usuario envía peso 70kg y altura -1m
        When el DTO es validado
        Then se lanza un error de tipo BadRequestException

    Scenario: Obtener historial sin filtros
        Given existen registros de cálculos previos
        When el usuario consulta el historial
        Then el sistema devuelve la lista ordenada por fecha descendente

    Scenario: Obtener historial con filtros de fechas
        Given existen registros de cálculos previos
        When el usuario consulta el historial con fechaInicio=2025-09-01 y fechaFin=2025-09-30
        Then el controlador pasa correctamente los filtros al servicio

    Scenario: Obtener historial vacío
        Given no existen registros en la base de datos
        When el usuario consulta el historial
        Then se devuelve una lista vacía

    Scenario: Error en cálculo de IMC
        Given ocurre un error en el servicio
        When el controlador intenta calcular el IMC
        Then se lanza el error al cliente
