Feature: Persistencia de cálculos de IMC en el backend

    Como usuario de la API de IMC
    Quiero poder calcular y guardar mi IMC
    Para luego consultar mi historial de cálculos

    Scenario: Guardar un cálculo de IMC exitosamente
        Given que envío un request POST a "/imc/calcular" con peso 70 y altura 1.75
        When el backend procesa el cálculo
        Then la respuesta debe tener status 201
        And debe incluir el IMC calculado
        And debe incluir la categoría correspondiente

    Scenario: Recuperar el historial de cálculos
        Given que ya existe al menos un cálculo de IMC guardado
        When envío un request GET a "/imc/historial"
        Then la respuesta debe tener status 200
        And debe devolver una lista de resultados
        And cada resultado debe incluir peso, altura, IMC, categoría y fecha
