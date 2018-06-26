# traisi-trip-diary

Trip Diary question extension for TRAISI

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