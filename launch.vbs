' launch.vbs - simple launcher (no port kills)
Option Explicit
On Error Resume Next

Dim fso, sh, folderPath, exePath, result
Set fso = CreateObject("Scripting.FileSystemObject")
Set sh  = CreateObject("WScript.Shell")

folderPath = Left(WScript.ScriptFullName, Len(WScript.ScriptFullName) - Len(WScript.ScriptName))
If Right(folderPath, 1) <> "\" Then folderPath = folderPath & "\"

exePath = folderPath & "pos-pdf-printer.exe"

' If EXE not present, quit
If Not fso.FileExists(exePath) Then WScript.Quit

' If process already running, do nothing
result = sh.Exec("tasklist /FI ""IMAGENAME eq pos-pdf-printer.exe""").StdOut.ReadAll
If InStr(LCase(result), "pos-pdf-printer.exe") = 0 Then
    sh.CurrentDirectory = folderPath
    sh.Run """" & exePath & """", 0, False
End If

Set sh = Nothing
Set fso = Nothing
