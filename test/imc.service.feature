Feature: IMC Service
    Como servicio de dominio
    Quiero calcular el IMC, clasificarlo y persistirlo
    Para poder consultar cálculos históricos

    Scenario Outline: Calcular IMC y categoría
        Given un usuario con peso <peso> kg y altura <altura> m
        When se calcula el IMC
        Then el resultado debe ser <imc> y la categoría "<categoria>"

        Examples:
            | peso | altura | imc   | categoria |
            | 70   | 1.75   | 22.86 | Normal    |
            | 50   | 1.75   | 16.33 | Bajo peso |
            | 80   | 1.75   | 26.12 | Sobrepeso |
            | 100  | 1.75   | 32.65 | Obeso     |

    Scenario: Guardar IMC en base de datos
        Given un usuario envía peso 70kg y altura 1.75m
        When se calcula el IMC
        Then el servicio crea y guarda la entidad en el repositorio

    Scenario: Obtener historial sin filtros
        Given existen registros en el repositorio
        When se consulta el historial sin filtros
        Then se devuelve la lista ordenada por fecha descendente

    Scenario: Obtener historial con fecha de inicio
        Given existen registros en el repositorio
        When se consulta el historial desde 2025-09-01
        Then se aplica el filtro "createdAt >= 2025-09-01"

    Scenario: Obtener historial con fecha de fin
        Given existen registros en el repositorio
        When se consulta el historial hasta 2025-09-30
        Then se aplica el filtro "createdAt <= 2025-09-30"

    Scenario: Obtener historial con rango de fechas
        Given existen registros en el repositorio
        When se consulta el historial entre 2025-09-01 y 2025-09-30
        Then se aplica el filtro "createdAt BETWEEN 2025-09-01 AND 2025-09-30"
