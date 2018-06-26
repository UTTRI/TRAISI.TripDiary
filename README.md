# traisi-trip-diary

Trip Diary question extension for TRAISI

## Requirements

1. Node.js > 8.1
2. TRAISI.SDK source or package reference

## Build Instructions

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

### Building

```console
dotnet traisi build
```

OR

```console
npm run build
dotnet build
```