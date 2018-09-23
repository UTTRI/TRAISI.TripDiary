# traisi-trip-diary

Trip Diary question extension for TRAISI

## Requirements

1. Node.js > 8.1
2. TRAISI.SDK source or package reference

## Build Instructions

### Webpack

Install global webpack

npm install -g webpack

### Config NuGet Package Sources

Create a NuGet.config file that creates a package source referencing the TRAISI.SDK "cli" output (package).

Example:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <add key="local-packages" value="../TRAISI.SDK/bin/cli/" />
  </packageSources>
</configuration>
```

### Restore Packages

```console
dotnet restore
```

### Initialize the Node Module

```console
dotnet traisi init <project.csproj> [--name|n <module_name>]
```

### References

Add a reference to the TRAISI.SDK project or dll in your project.

### Debug and Development

A separate webpack config file has been provided to make use of the build it in watch capabilities. Any changes to source *ts will trigger a compile.
Once rebuilding / compiling - the bundled files will be copied to the development folder of the TRAISI server for faster reloading.

### Building

```console
dotnet traisi build
```

OR

```console
npm run build
dotnet build
```