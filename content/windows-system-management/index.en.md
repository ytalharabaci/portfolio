---
title: "Windows System Administration Guide"
date: '2025-03-09'
description: "A comprehensive guide to Windows system administration processes, CMD and PowerShell commands, MMC management consoles, Active Directory administrative tools, and WMI infrastructure."
draft: false
type: posts
topic: cloud-infrastructure
tags: ["Windows Server", "Active Directory", "System Administration", "PowerShell", "CMD"]
image: featured.webp
featuredImageAlt: "Server room control center with large monitoring panels"
---

Windows System Administration encompasses the workflows, policies, and utilities required to maintain and optimize Windows environments. These responsibilities span local and directory user administration, performance optimization, security baseline enforcement, and network connectivity controls. System administrators leverage the Microsoft Management Console (MMC), Windows PowerShell, and Group Policy Objects (GPO) to monitor health, triage incidents, and automate recurring operations. This guide provides a structured technical reference for both standalone workstations and enterprise Active Directory infrastructure.

---

## System Administration with Command Prompt (CMD)

The **Command Prompt (CMD)** serves as the native command-line interface for the Windows operating system. For automated workflows, commands can be compiled into **batch scripts** with a `.bat` or `.cmd` extension, executed manually or dispatched via task schedulers.

### System & Hardware Information Commands

#### Display System Details (`systeminfo`)
Displays comprehensive operating system, hotfix, hardware, and network configuration data.
```cmd
systeminfo
```

#### Display OS Version (`ver`)
Displays the exact Windows kernel version and build number.
```cmd
ver
```

#### Display Hostname (`hostname`)
Outputs the local computer name registered on the network.
```cmd
hostname
```

#### System Time and Date (`time` / `date`)
Displays and permits administrative modification of the system clock and calendar.
```cmd
time
date
```

#### Clear Command Screen (`cls`)
Clears the active command-line window buffer.
```cmd
cls
```

### File & Directory Management Commands

#### List Directory Contents (`dir`)
Lists files and subdirectories with sizes, timestamps, and attributes.
```cmd
dir
```

#### Change Directory (`cd`)
Navigates the current shell context to a specified directory path.
```cmd
cd <target_directory>
```

#### Copy Files (`copy`)
Copies one or more files from a source location to a destination path.
```cmd
copy <source> <destination>
```

#### Display File Content (`type`)
Streams the textual contents of a file directly to the console output.
```cmd
type <filename>
```

#### Echo String or Variable (`echo`)
Prints text or evaluates environment variables to the standard output.
```cmd
echo Hello World
```

#### Delete File (`del`)
Deletes specified files permanently from the file system.
```cmd
del <filename>
```

#### Remove Directory (`rmdir`)
Deletes a specified directory (`/s` removes subdirectories and files recursively).
```cmd
rmdir <directory_name>
```

### Networking & Connectivity Diagnostics

#### Inspect IP Configuration (`ipconfig`)
Displays IP addresses, subnet masks, and default gateways for all physical and virtual network adapters.
```cmd
ipconfig
```

#### Flush DNS Cache (`ipconfig /flushdns`)
Purges the local DNS resolver cache to remediate stale name resolution issues.
```cmd
ipconfig /flushdns
```

#### Test Network Reachability (`ping`)
Dispatches ICMP echo requests to evaluate packet loss and round-trip latency to a remote endpoint.
```cmd
ping <target_address>
```

#### Print Routing Table (`route print`)
Displays the active IPv4 and IPv6 network routing table and interface list.
```cmd
route print
```

#### List Network Shares (`net share`)
Displays all active network shares configured on the local host.
```cmd
net share
```

### Process, Service & Power Management

#### List Running Tasks (`tasklist`)
Enumerates all active processes, executable names, process IDs (PID), and memory utilization.
```cmd
tasklist
```

#### Terminate Process (`taskkill`)
Forcefully terminates an active task by PID or image name.
```cmd
taskkill /pid <process_id> /f
```

#### Manage Windows Services (`sc`)
Controls background Windows services (query, start, stop, pause, config).
```cmd
sc start <service_name>
sc stop <service_name>
```

#### System Shutdown and Restart (`shutdown`)
Instructs the operating system to power down or reboot with optional countdown timers.
```cmd
shutdown /s /t 0
shutdown /r /t 0
```

#### Power Scheme Configuration (`powercfg`)
Analyzes and controls power management schemes and battery diagnostics.
```cmd
powercfg /list
```

### Disk Management & Filesystem Maintenance

#### Manage Storage Partitions (`diskpart`)
Launches the interactive partition manipulation utility.
```cmd
diskpart
list volume
```

#### Disk Cleanup Utility (`cleanmgr`)
Launches the automated temporary file purge tool to reclaim storage capacity.
```cmd
cleanmgr
```

#### Filesystem Check and Repair (`chkdsk`)
Audits NTFS/FAT volumes for metadata corruption and bad sectors.
```cmd
chkdsk C: /f
```

### Local User & Group Administration

#### Manage Local User Accounts (`net user`)
Lists local accounts, creates credentials, or revokes user privileges.
```cmd
net user
net user <username> <password> /add
net user <username> /delete
```

#### Manage Local Security Groups (`net localgroup`)
Displays local security groups and assigns or audits group memberships.
```cmd
net localgroup
```

---

## Microsoft Management Console (MMC) Administration

The **Microsoft Management Console (MMC)** provides a standardized administrative shell for managing hardware, software, and networking components through modular snap-in files bearing the `.msc` extension. These snap-ins can be opened directly from the `Win + R` Run dialog.

### Core System & Hardware Snap-ins

#### Computer Management (`compmgmt.msc`)
The primary consolidated console integrating System Tools (Event Viewer, Device Manager, Shared Folders), Storage (Disk Management), and Services.

![Bilgisayar Yönetimi: compmgmt.msc](./1_MpU8TSbaM6qR2u2-ihXfqg.webp)

![Bilgisayar Yönetimi: compmgmt.msc (2)](./1_qYkUr1fgV87iFe6utqzSdA.webp)

#### Device Manager (`devmgmt.msc`)
Provides visibility into physical hardware devices, enabling driver installation, rollbacks, and diagnostic identification of malfunctioning hardware.

![Aygıt Yöneticisi: devmgmt.msc](./1_-9-W8H4OOTMvEsRMj-Hqdw.webp)

![Aygıt Yöneticisi: devmgmt.msc (2)](./1_7w5iLQ5wGIt1r8PDdJxh9A.webp)

#### Disk Management (`diskmgmt.msc`)
Administers partition schemes, volume formatting, drive letter assignments, and dynamic disk configurations.

![Disk Yönetimi: diskmgmt.msc](./1_R4PceSSdAKcNpyGNmeTdkw.webp)

![Disk Yönetimi: diskmgmt.msc (2)](./1_eBTghtHiVBRBsAQj8f8e_w.webp)

#### Services (`services.msc`)
Enables administrators to inspect, restart, stop, and set startup types (Automatic, Manual, Disabled) for all installed Windows background services.

![Hizmetler: services.msc](./1_0KIsamFvchIgkx-NituRgg.webp)

![Hizmetler: services.msc (2)](./1_6uv3dpx_XipXh_qbq01PFg.webp)

#### Event Viewer (`eventvwr.msc`)
The central repository for Windows Event Logs, capturing security audit events, operating system errors, and application warnings.

![Olay Görüntüleyici: eventvwr.msc](./1_ULhrQ5wKEn3HO73IVquJtw.webp)

![Olay Görüntüleyici: eventvwr.msc (2)](./1_N8gONxQA7kwwBszjUEvAWg.webp)

#### Performance Monitor (`perfmon.msc`)
Tracks real-time performance telemetry across CPU, memory, storage, and network queues with customizable diagnostic counters.

![Performans İzleyicisi: perfmon.msc](./1_drGVabk1_JuCxoBQLN9ldw.webp)

![Performans İzleyicisi: perfmon.msc (2)](./1_PkQsxpMaGI2TSQDpb9R8wQ.webp)

#### Task Scheduler (`taskschd.msc`)
Schedules automated maintenance scripts, backups, and program launches based on time intervals or specific system triggers.

![Görev Zamanlayıcı: taskschd.msc](./1_aw0BmV1O3rpNqEEpvbv07Q.webp)

![Görev Zamanlayıcı: taskschd.msc (2)](./1_771nW9DentMsT-0R_XxE2w.webp)

### Security, Policy & Sharing Snap-ins

#### Local Security Policy (`secpol.msc`)
Configures password complexity policies, account lockout parameters, audit policies, and user rights assignments on standalone or non-domain systems.

![Yerel Güvenlik İlkesi: secpol.msc](./1_eQz3psGx6dDTuQOk0rRyCA.webp)

![Yerel Güvenlik İlkesi: secpol.msc (2)](./1_l3kApq4SYaZ7M-8L5KQVKg.webp)

#### Local Group Policy Editor (`gpedit.msc`)
Enforces system and user policies across desktop settings, security restrictions, and administrative templates (available on Windows Pro and Enterprise editions).

![Yerel Grup İlkesi Düzenleyicisi: gpedit.msc](./1_dQsN3KsDl549381FOo6nDA.webp)

![Yerel Grup İlkesi Düzenleyicisi: gpedit.msc (2)](./1_XETMBSBOzK7D4tqp1o8mrQ.webp)

#### Local Users and Groups (`lusrmgr.msc`)
Manages local security principals, credential parameters, and local group memberships.

![Yerel Kullanıcılar ve Gruplar: lusrmgr.msc](./1_Ph4cBMvCzWWC8F4wSrBKMA.webp)

![Yerel Kullanıcılar ve Gruplar: lusrmgr.msc (2)](./1_PpzC4VflE9EQfpHgFzywDA.webp)

#### Windows Defender Firewall with Advanced Security (`wf.msc`)
Constructs inbound and outbound network filtering rules matching protocols, port numbers, authorized IP subnets, and executables.

![Windows Defender Güvenlik Duvarı ile Gelişmiş Güvenlik](./1_XejYGc58spUFIjCG_1iN2A.webp)

![Windows Defender Güvenlik Duvarı](./1_ChA1HxpNqJ7ucgVk_cA-mw.webp)

#### Shared Folders (`fsmgmt.msc`)
Audits active SMB shares, open file locks, and active client sessions across the network.

![Paylaşılan Klasörler: fsmgmt.msc](./1_1_05HPAMwCvgzwqHjRKYKw.webp)

![Paylaşılan Klasörler: fsmgmt.msc (2)](./1_weE9YAJ7nRYtMRsPpYRszw.webp)

#### Local Computer Certificates (`certlm.msc`)
Manages the machine certificate store, trusted root authorities, intermediate issuers, and private encryption keys.

![Sertifika Yönetimi: certlm.msc](./1_cijWlhOxGxjRqXHwSebeOQ.webp)

![Sertifika Yönetimi: certlm.msc (2)](./1_4kxWFhlcjgX6STpedTFqDA.webp)

### Enterprise & Network Service Snap-ins

#### Print Management (`printmanagement.msc`)
Centralizes local and network print server queues, print spoolers, and architecture-specific driver deployments.

![Yazdırma Yönetimi: printmanagement.msc](./1_MTSqO1OEapX1hDEQ_s7QuA.webp)

![Yazdırma Yönetimi: printmanagement.msc (2)](./1_HmtdMCPwr-n95OLQwRQFNg.webp)

#### Remote Desktop Services Manager (`tsadmin.msc`)
Legacy console for auditing and disconnecting active user sessions across terminal servers.

![Uzak Masaüstü Hizmetleri Yöneticisi: tsadmin.msc](./1_kO1BtfC5frTaF-qbfuBCaQ.webp)

![Uzak Masaüstü Hizmetleri Yöneticisi: tsadmin.msc (2)](./1_BPLbsJAB4eySqgSpwwG3uw.webp)

#### Authorization Manager (`azman.msc`)
Provides role-based access control (RBAC) governance for legacy .NET application scopes.

![Yetkilendirme Yöneticisi: azman.msc](./1_5ycPzQAAhzh_4Ut2SLA1Ow.webp)

![Yetkilendirme Yöneticisi: azman.msc (2)](./1_tPmIFI6iET881lNc83L8EQ.webp)

#### Component Services (`comexp.msc`)
Administers COM+ enterprise applications, Distributed Transaction Coordinator (DTC) boundaries, and system components.

![Bileşen Hizmetleri: comexp.msc](./1_q5vZ5cZncnQHSTB3ADbqzg.webp)

![Bileşen Hizmetleri: comexp.msc (2)](./1_pIdbGHCOEizkpzvXjro0aA.webp)

---

## Run (Win+R) Quick Reference Tables

The following reference tables consolidate essential administrative shortcuts executable via the `Win + R` Run dialog.

### Management Consoles (MMC)

| Shortcut | Description / Target Console |
| :--- | :--- |
| `eventvwr.msc` | Event Viewer |
| `devmgmt.msc` | Device Manager |
| `compmgmt.msc` | Computer Management |
| `diskmgmt.msc` | Disk Management |
| `perfmon.msc` | Performance Monitor |
| `resmon` | Resource Monitor |
| `secpol.msc` | Local Security Policy |
| `gpedit.msc` | Local Group Policy Editor |
| `lusrmgr.msc` | Local Users and Groups |
| `services.msc` | Services Management |
| `taskschd.msc` | Task Scheduler |
| `certlm.msc` | Certificates (Local Computer) |
| `certmgr.msc` | Certificates (Current User) |
| `fsmgmt.msc` | Shared Folders |
| `wf.msc` | Windows Defender Firewall with Advanced Security |
| `printmanagement.msc` | Print Management |

### System Settings (Control Panel Applets)

| Shortcut | Description / Target Applet |
| :--- | :--- |
| `control` | Control Panel |
| `control admintools` | Administrative Tools |
| `sysdm.cpl` | System Properties (Environment variables, computer name) |
| `ncpa.cpl` | Network Connections |
| `firewall.cpl` | Windows Defender Firewall |
| `appwiz.cpl` | Programs and Features (Uninstall/modify software) |
| `powercfg.cpl` | Power Options |
| `timedate.cpl` | Date and Time Settings |
| `intl.cpl` | Region and Language Settings |
| `main.cpl` | Mouse Properties |
| `mmsys.cpl` | Sound Settings |
| `inetcpl.cpl` | Internet Properties |
| `desk.cpl` | Display Settings |

### Diagnostics & System Maintenance

| Shortcut | Description / Target Tool |
| :--- | :--- |
| `msconfig` | System Configuration (Boot and startup controls) |
| `taskmgr` | Task Manager |
| `dxdiag` | DirectX Diagnostic Tool |
| `cleanmgr` | Disk Cleanup |
| `dfrgui` | Defragment and Optimize Drives |
| `regedit` | Registry Editor |
| `charmap` | Character Map |
| `snippingtool` | Snipping Tool |
| `magnify` | Magnifier |
| `osk` | On-Screen Keyboard |

### Command Shells & Networking

| Shortcut | Description / Target Tool |
| :--- | :--- |
| `cmd` | Command Prompt |
| `powershell` | Windows PowerShell |
| `powershell_ise` | PowerShell ISE |
| `mstsc` | Remote Desktop Connection (RDP) |
| `calc` | Calculator |
| `notepad` | Notepad |
| `msinfo32` | System Information |
| `winver` | Windows Version Dialog |

---

## Active Directory Administrative Tools (ADAT)

Windows Active Directory Administrative Tools (ADAT) centralize directory management across corporate domains and forests.

![Windows Active Directory Administrative Tools (ADAT), bir Active Directory (AD) ortamını yönetmek ve yapılandırmak için](./1_KUc3xyohoMX461oMMITE7g.webp)

### Active Directory Users and Computers (ADUC)
Administers user accounts, computer objects, security groups, and Organizational Units (OUs). Administrators assign password policies, reset credentials, and structure directory hierarchies.

![Microsoft'un Active Directory hizmeti içinde, kullanıcı hesaplarını, bilgisayarları, grupları ve organizasyon birimlerini](./1_K_zUm1r0QVCnLQgnDwczLA.webp)

### Active Directory Domains and Trusts
Governs domain and forest trust relationships (one-way, two-way, transitive) and raises domain and forest functional levels.

![Microsoft'un Active Directory hizmeti içinde, etki alanları (domain) arasındaki güven ilişkilerini yönetmek için kullanılır](./1_QDVkcGG3felLhq9GADjBeA.webp)

### Active Directory Sites and Services
Optimizes Active Directory replication topology by mapping physical corporate subnets to logical sites and inter-site replication links.

![AD'nin fiziksel topolojisini yönetmek için kullanılır](./1_eFJ89GnmWgGiAWAFvMmwsQ.webp)

### Active Directory Administrative Center (ADAC)
A modern administrative interface with integrated PowerShell history recording, Fine-Grained Password Policies, and Active Directory Recycle Bin recovery.

![AD nesnelerini yönetmek için daha modern bir arayüz sunar](./1_gVvHgx857TBhTzD6NmW7jQ.webp)

### Group Policy Management Console (GPMC)
Enforces central Group Policy Objects (GPOs) governing workstation configurations, software deployment, and enterprise security baselines.

![Grup Politikalarını (Group Policy) yönetmek için kullanılır](./1_xbLyZ5DCZebIw1hn2NsiVw.webp)

### Active Directory Module for Windows PowerShell
Bridges directory operations to automation pipelines via specialized cmdlets such as `Get-ADUser`, `New-ADGroup`, and `Set-ADAccountPassword`.

![AD yönetim işlemlerini komut satırı üzerinden gerçekleştirmek için kullanılır](./1_26CfeO0LwUnxTiVbXoBOxg.webp)

---

## Windows Management Instrumentation (WMI)

**Windows Management Instrumentation (WMI)** is Microsoft's implementation of Web-Based Enterprise Management (WBEM) for querying hardware, software, and operational metrics.

WMI empowers administrators to:
* Query processor, memory, and disk telemetry across the fleet.
* Remotely start, stop, or pause Windows services.
* Monitor operational events dynamically using WMI Event Consumers.
* Query remote hosts over standard RPC/WinRM boundaries.

Telemetry is surfaced via **WMI Providers** and structured according to the Common Information Model (CIM), queryable through **WMI Query Language (WQL)**.

![WMI, WMI Provider'lar aracılığıyla çalışır](./1_8Uxx0e4xpvHQA5JVh43iIQ.webp)

### WMI Access Interfaces & Practical Examples

#### WMI via PowerShell
PowerShell offers direct, modern bindings for querying WMI classes:
```powershell
Get-WmiObject -Class Win32_Processor
```

#### WMI via VBScript
A lightweight automation approach historically used in legacy Windows deployments:
```vbscript
strComputer = "."  
Set objWMIService = GetObject("winmgmts:\\" & strComputer & "\root\cimv2")  
Set colDisks = objWMIService.ExecQuery("SELECT * FROM Win32_DiskDrive")  
For Each objDisk in colDisks  
    WScript.Echo "DeviceID: " & objDisk.DeviceID  
Next
```

#### WMI via .NET
Enterprise software queries WMI programmatically via the `System.Management` namespace:
```csharp
using System.Management;  
  
ManagementObjectSearcher searcher = new ManagementObjectSearcher("SELECT * FROM Win32_Processor");
```

#### WMI via WMIC Command Line
Executes direct command-line queries against local or remote WMI stores:
```cmd
wmic cpu get name
```

---

## Cloud Identity Management: Azure Active Directory (Entra ID)

**Azure Active Directory (Azure AD / Microsoft Entra ID)** is Microsoft’s cloud-native identity and access management solution, integrating with on-premise Active Directory in hybrid architectures.

* **Hybrid Identity Synchronization:** Connects local Active Directory domain controllers to cloud tenants, enabling unified single sign-on (SSO).
* **Zero Trust Architecture:** Explicitly validates identity, endpoint security posture, and least-privilege permissions on every authentication request.
* **Conditional Access:** Evaluates signals such as geolocation, IP reputation, and device compliance before granting access.
* **Identity Protection:** Leverages machine-learning models to flag compromised credentials and anomalous sign-ins.
* **Unified Endpoint Management:** Integrates with Microsoft Intune for comprehensive MDM/MAM lifecycle governance.

![Microsoft'un bulut tabanlı kimlik ve erişim yönetimi çözümüdür](./1_pqT3BvT-gibeMBhl0SiIFg.webp)

Administrators can access and explore this ecosystem with their corporate Microsoft account at <https://portal.azure.com>.
