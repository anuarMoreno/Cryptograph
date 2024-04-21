## README

Consulta el sitio web creado: https://codexam.cloud/

En este repositorio, se proporciona una guía para construir una base de datos en AWS, extraer información de la API de CoinMarketCap mediante una función Lambda escrita en Python, y luego desplegar una página web donde se muestra un gráfico con la información extraída utilizando un contenedor Docker.

Complementando con el repositorio https://github.com/anuarMoreno/Python_Lambda Sigue los pasos detallados a continuación para configurar y desplegar el proyecto:

## Instrucciones para Crear la Base de Datos DynamoDB

1. Accede al Panel de AWS Management Console:
   - Inicia sesión en tu cuenta de AWS y accede al panel de AWS Management Console.
2. Selecciona DynamoDB:
   - En la consola de AWS, selecciona el servicio "DynamoDB".
3. Crea una Nueva Tabla:
   - Haz clic en el botón "Create table" para crear una nueva tabla en DynamoDB.
4. Define el Nombre de la Tabla:
   - Ingresa un nombre para tu tabla, por ejemplo, "CryptoPrices".
5. Configura la Clave de Partición y Opcionalmente la Clave de Ordenamiento:
   - Define la clave de partición para tu tabla. En este caso, se escoge un "timestamp" como clave de partición. Esto te permitirá almacenar la fecha en formato Unix TimeStamp.
6. Configura la Capacidad:
   - Selecciona DynamoDB On-Demand.
7. Revisa y Crea la Tabla:
   - Revisa la configuración de tu tabla y haz clic en el botón "Create table" para crearla en DynamoDB.

## Carga de datos a la base de datos en Dynamo DB

Para ello se configura una función lambda la cual tiene en sus permisos el acceso necesario para escribir en la base de datos Dynamo DB.

1. `mainFunction.py`: Este archivo contiene tres funciones principales que utilizo para obtener los precios de Bitcoin y Ethereum de la API de CoinMarketCap, escribir estos precios en una tabla de DynamoDB y manejar la ejecución de estas funciones en un entorno de AWS Lambda.

Las dependencias que utilizo son:

- json: Para trabajar con datos en formato JSON.
- boto3: Para interactuar con los servicios de AWS, en este caso, DynamoDB.
- os: Para trabajar con variables de entorno.
- datetime y timezone: Para trabajar con fechas y horas.
- requests: Para hacer solicitudes HTTP.
- decimal: Para trabajar con números decimales.

Las funciones en este archivo son:

- `obtener_precio_crypto()`: Hago una solicitud GET a la API de CoinMarketCap para obtener los precios más recientes de Bitcoin y Ethereum en USD. Utilizo una sesión de requests para hacer la solicitud y paso los parámetros y encabezados necesarios. Luego, extraigo los precios y la fecha de la consulta de la respuesta JSON y los devuelvo.
- `escribir_en_dynamodb(bitcoin_price, ethereum_price, querydate)`: Esta función toma los precios de Bitcoin y Ethereum y la fecha de la consulta, y los escribe en una tabla de DynamoDB. Convierto la fecha de la consulta a un objeto datetime y luego a un timestamp de Unix. Luego, utilizo boto3 para escribir un nuevo elemento en la tabla de DynamoDB con estos datos.
- `lambda_handler(event, context)`: Esta es la función principal que se ejecuta cuando se invoca mi función Lambda. Llamo a obtener_precio_crypto() para obtener los precios de las criptomonedas. Si no hay errores, llamo a escribir_en_dynamodb() para escribir los precios en DynamoDB y devuelvo una respuesta con un código de estado 200. Si hay un error, devuelvo una respuesta con un código de estado 500.

## Obtención de datos guardados en Dynamo DB

Para ello se usan principalmente dos scripts de JavaScript y son los siguientes:

1. `server.js`: Este es el archivo principal de mi servidor. Utilizo el marco Express para crear el servidor y manejar las solicitudes HTTP. Las dependencias que utilizo son:

- express: Para crear el servidor y manejar las rutas.
- cors: Para permitir el intercambio de recursos de origen cruzado (CORS), lo que me permite aceptar solicitudes de diferentes orígenes.
- path: Para trabajar con rutas de archivos y directorios.
- ../public/scripts/apiRequest: Este es un módulo  que exporta la función getChartData, que utilizo para obtener los datos de mi base de datos DynamoDB.

En este archivo, configuro mi servidor para usar CORS, servir archivos estáticos desde el directorio public, y manejar las solicitudes GET a la ruta /chart-data llamando a la función getChartData. Si getChartData se resuelve con éxito, respondo con los datos recuperados en formato JSON. Si ocurre un error, respondo con un código de estado 500 y el mensaje de error. Un archivo chart.js incluido en el html de la pagina web se encarga de hacer una solicitud fetch a la ruta /chart-data del servidor, con la respuesta realiza el respectivo procesamiento de los datos y los grafica.

2. `apiRequest.js`: Este archivo contiene la función getChartData, que utilizo para obtener datos de mi base de datos DynamoDB. Utilizo el SDK de AWS para Node.js para interactuar con DynamoDB. Las dependencias que utilizo son:

- aws-sdk: Para interactuar con los servicios de AWS, en este caso, DynamoDB.

En este archivo, configuro el SDK de AWS con mis credenciales de AWS y la región, y creo un nuevo objeto DynamoDB. Luego, realizo una operación de escaneo en mi tabla de DynamoDB para recuperar todos los elementos. Proceso los elementos recuperados para extraer los timestamps y los precios de Bitcoin y Ethereum, y los agrupo en tres arrays. Finalmente, devuelvo una promesa que se resuelve con estos arrays.

## Sigue estos pasos para ejecutar la aplicación Cryptograph en tu máquina local:

1. Asegúrate de tener instalado Git y Node.js en tu máquina.

2. Abre una terminal.

3. Clona el repositorio con el siguiente comando:

```bash
git clone https://github.com/anuarMoreno/Cryptograph.git
```

4. Cambia al directorio del proyecto con el siguiente comando:

```bash
cd Cryptograph
```

5. Instala las dependencias del proyecto con el siguiente comando:

```bash
npm install
```

6. Ahora puedes ejecutar la aplicación con el siguiente comando:

```bash
npm start
```

Este comando ejecutará `node src/server.js`, que es el punto de entrada de la aplicación.

7. Abre un navegador y navega a la URL que se muestra en la terminal para ver la aplicación en funcionamiento.

Si tienes algún problema, por favor abre un issue en el repositorio de GitHub.


## Para utilizar este Dockerfile y crear un contenedor Docker, sigue estos pasos:

1. Asegúrate de tener Docker instalado en tu máquina.

2. Abre una terminal.

3. Navega al directorio donde se encuentra el Dockerfile.

4. Construye la imagen Docker con el siguiente comando:

```bash
docker build -t '<nombre-de-tu-imagen>' .
```
Reemplaza `<nombre de la imagen>` con el nombre que quieras darle a la imagen Docker.

5. Una vez que la imagen se ha construido, puedes crear y ejecutar un contenedor con el siguiente comando:

```bash
docker run -p 80:80 -e"NODE_ENV=TUS_CREDENCIALES_DE_AWS"
```

6. Ahora la aplicación debería estar ejecutándose en el puerto 80 de tu máquina. Puedes acceder a ella abriendo un navegador y navegando a `http://localhost:80`.
