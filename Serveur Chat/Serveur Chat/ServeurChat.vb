Imports System.Net.Sockets
Imports System.IO
Imports System.Net

Module ServeurCht
    Private server As TcpListener
    Private client As New TcpClient
    Private ipendpoint As IPEndPoint = New IPEndPoint(IPAddress.Any, 2000)
    Private list As New List(Of Connection)
    Private Structure Connection
        Dim stream As NetworkStream
        Dim streamw As StreamWriter
        Dim streamr As StreamReader
        Dim nick As String
    End Structure




    Sub Main()
        Console.WriteLine("Serveur OK!")
        server = New TcpListener(ipendpoint)
        server.Start()




        While True


            client = server.AcceptTcpClient

            Dim c As New Connection
            c.stream = client.GetStream
            c.streamr = New StreamReader(c.stream)
            c.streamw = New StreamWriter(c.stream)

            c.nick = c.streamr.ReadLine

            list.Add(c)
            Console.WriteLine("[" & Date.Now.ToLongTimeString & "] " & c.nick & " s'est connecté.")

            Dim t As New Threading.Thread(AddressOf ListenToConnection)
            t.Start(c)

        End While
    End Sub


    Private Sub ListenToConnection(ByVal con As Connection)
        Do
            Try
                Dim tmp As String = con.streamr.ReadLine
                Console.WriteLine("[" & Date.Now.ToLongTimeString & "] " & con.nick & ": " & tmp)
                For Each c As Connection In list
                    Try
                        c.streamw.WriteLine("[" & Date.Now.ToLongTimeString & "] " & con.nick & ": " & tmp)
                        c.streamw.Flush()
                    Catch
                    End Try
                Next
            Catch
                list.Remove(con)
                Console.WriteLine("[" & Date.Now.ToLongTimeString & "] " & con.nick & " s'est déconnecté.")
                Exit Do
            End Try
        Loop
    End Sub
End Module
