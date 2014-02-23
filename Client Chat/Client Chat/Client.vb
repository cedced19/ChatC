Imports System.Net.Sockets
Imports System.IO

Public Class Client
    Private stream As NetworkStream
    Private streamw As StreamWriter
    Private streamr As StreamReader
    Private client As New TcpClient
    Private t As New Threading.Thread(AddressOf Listen)
    Private Delegate Sub DAddItem(ByVal s As String)
    Private nick As String = "unknown"
    Private ip As String = "unknown"

    Private Sub AddItem(ByVal s As String)
        ListBox1.Items.Add(s)
    End Sub

    Private Sub Form1_Shown(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Shown
        Try
            client.Connect(ip, 2000)
            If client.Connected Then
                stream = client.GetStream
                streamw = New StreamWriter(stream)
                streamr = New StreamReader(stream)

                Me.Text = "Chat C : " & ip
                Heure.Start()

                streamw.WriteLine(nick)
                streamw.WriteLine("Je viens de me connecté !")
                streamw.Flush()
                t.Start()
            Else
                MessageBox.Show("Le serveur n'est pas lancé!")
                End
            End If
        Catch ex As Exception
            MessageBox.Show("Le serveur n'est pas lancé! (Error Exception)")
            End
        End Try
    End Sub

    Private Sub Listen()
        While client.Connected
            Try
                Me.Invoke(New DAddItem(AddressOf AddItem), streamr.ReadLine)
            Catch
                MessageBox.Show("Le serveur n'est pas lancé!")
                End
            End Try
        End While
    End Sub

    Private Sub Button1_Click(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles Button1.Click
        If TextBox1.Text = "" Then
            MsgBox("Ecrivez quelque chose", MsgBoxStyle.Critical, "Attention")
        Else
            streamw.WriteLine(TextBox1.Text)
            streamw.Flush()
            TextBox1.Clear()
        End If
    End Sub

    Private Sub Form1_Load(ByVal sender As System.Object, ByVal e As System.EventArgs) Handles MyBase.Load
        nick = InputBox("Pseudo: ", "Choisir un pseudo", "Pseudo")
        ip = InputBox("Ip: ", "Choisir un serveur", "")
    End Sub

    Private Sub Button2_Click(sender As Object, e As EventArgs) Handles Button2.Click
        streamw.WriteLine("Je vais me deconnecté !")
        streamw.Flush()
        End
    End Sub

    Private Sub Heure_Tick(sender As Object, e As EventArgs) Handles Heure.Tick
        Label1.Text = Date.Now.ToShortTimeString
    End Sub

    Private Sub Label1_Click(sender As Object, e As EventArgs) Handles Label1.Click
        MsgBox("Oui il est bien :" & Label1.Text & " !", MsgBoxStyle.Information, "Information")
    End Sub
End Class