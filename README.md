# Sistema de Gestión de Clientes

Aplicación web moderna para organizar y gestionar datos de clientes por empresa, desarrollada con Next.js, TypeScript y Tailwind CSS.

## Características

- **Vista de Empresas**: Visualiza todas las empresas con tarjetas informativas
- **Gestión de Clientes**: Accede a fichas detalladas de cada cliente por empresa
- **Búsqueda Avanzada**: Busca empresas y clientes por nombre, función o email
- **Filtros**: Filtra clientes por estado (activos/inactivos)
- **Vistas Múltiples**: Cambia entre vista de cuadrícula y lista
- **Exportación**: Descarga los datos filtrados en formato CSV
- **Diseño Responsivo**: Interfaz adaptable a todos los dispositivos
- **Modo Oscuro**: Compatible con preferencias del sistema

## Instalación

1. Navega al directorio del proyecto:
```bash
cd /Users/miguelangelbatistaruiz/Documents/Dossier\ MABR/Clients/client-manager
```

2. Instala las dependencias (si aún no lo has hecho):
```bash
npm install
```

## Uso

1. Inicia el servidor de desarrollo:
```bash
npm run dev
```

2. Abre tu navegador en [http://localhost:3000](http://localhost:3000)

## Estructura de Archivos CSV

Los archivos CSV deben estar ubicados en:
```
/Users/miguelangelbatistaruiz/Documents/Dossier MABR/Clients/
```

Formato esperado de los CSV (separado por punto y coma):
- No
- Nom (Apellido)
- Prénom (Nombre)
- Actif (Estado: "1 - Oui" para activo)
- Fonction (Función/Cargo)
- Téléphone
- Tél. portable
- Email
- Accès EasyMission
- Editeur de mutation
- Date de mutation

## Funcionalidades Principales

### Página Principal
- Lista todas las empresas disponibles
- Muestra estadísticas generales (total empresas, clientes, promedio)
- Barra de búsqueda para filtrar empresas

### Página de Empresa
- Información detallada de la empresa
- Estadísticas de clientes (total, activos, inactivos)
- Búsqueda por nombre, función o email
- Filtros por estado del cliente
- Vista de cuadrícula o lista
- Exportación a CSV de los datos filtrados

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## Tecnologías Utilizadas

- **Next.js 15** - Framework React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Lucide React** - Iconos modernos
- **PapaParse** - Procesamiento de archivos CSV

## Notas

- Los archivos CSV se leen directamente desde el sistema de archivos
- Los nombres de archivo que contienen "Clients-" o "cllients Adecco-" se omiten de la lista de empresas
- La aplicación maneja automáticamente la codificación de caracteres especiales en los nombres de archivo
