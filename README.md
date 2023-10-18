# Health Stash App - Projeto FIAP Enterprise Challenge

Bem-vindo ao Health Stash, um aplicativo móvel desenvolvido com React Native Expo que oferece uma solução abrangente para gerenciamento de saúde, integração com o Firebase para autenticação e serviços do FHIR para informações de pacientes e médicos.

Este projeto foi desenvolvido como parte do FIAP Enterprise Challenge, um desafio acadêmico da FIAP.

## Visão Geral

O Health Stash App é uma plataforma que visa simplificar o acompanhamento da saúde dos pacientes e a gestão de informações médicas por médicos. Ele integra os seguintes recursos:

- **Autenticação com Firebase:** Usamos o Firebase para garantir a segurança e autenticar os usuários no aplicativo.

- **Serviços FHIR:** O aplicativo se conecta aos serviços do FHIR, incluindo Patient (Paciente), Practitioner (Médico), Condition (Condição), Appointment (Agendamento) e MedicationRequest (Prescrição de Medicamentos) para fornecer informações de saúde atualizadas e precisas.

## Sobre o Padrão FHIR

O FHIR (Fast Healthcare Interoperability Resources) é um padrão de interoperabilidade em saúde amplamente adotado pela comunidade médica. Ele não é um produto ou tecnologia da Microsoft, mas sim um padrão desenvolvido pela HL7 (Health Level Seven International) para facilitar a troca de informações de saúde eletrônicas entre sistemas de saúde.

**Principais Características do FHIR:**

- **Simplicidade:** O FHIR é conhecido por sua abordagem simplificada e baseada em recursos, tornando-o fácil de implementar.

- **Padrão Moderno:** Projetado para ser compatível com tecnologias da web, como JSON e XML.

- **Interoperabilidade:** Melhora a interoperabilidade entre sistemas de saúde, permitindo a troca de informações de forma consistente.

- **Recursos Padrão:** Define recursos padrão para informações de saúde, tornando a troca de informações estruturadas eficiente.

O FHIR é uma parte fundamental da infraestrutura de saúde digital em todo o mundo e está sendo amplamente adotado para melhorar o compartilhamento de informações de saúde entre sistemas.

## Requisitos do Projeto Expo

Certifique-se de ter o ambiente de desenvolvimento Expo configurado. Se você ainda não o configurou, siga as etapas abaixo:

1. Instale o Expo CLI globalmente:
   ```bash
   npm install -g expo-cli
   ```
2. Clone este repositório em sua máquina local.
3. Instale todas as dependências usando npm install ou yarn install no diretório do projeto.
4. Configure as credenciais do Firebase e a integração com os serviços do FHIR.

## Configuração

Após concluir a instalação dos requisitos do projeto Expo e configurar as credenciais, siga estas etapas para configurar e executar o aplicativo:

1. Execute o aplicativo com o seguinte comando:
   ```bash
   expo start
   ```
2. Um servidor de desenvolvimento Expo será iniciado e você receberá um código QR no terminal.
3. Escaneie o código QR com o aplicativo Expo Go no seu dispositivo móvel ou use um emulador para testar o aplicativo.

## Testando o Aplicativo

Após executar o aplicativo em seu dispositivo ou emulador, explore as funcionalidades, incluindo o registro de pacientes e médicos, agendamento de consultas e o gerenciamento de pacientes por médicos. Certifique-se de testar a integração com os serviços FHIR para obter informações de pacientes e médicos.

## Contribuições

Estamos abertos a contribuições e melhorias para o Health Stash App. Sinta-se à vontade para criar issues, enviar pull requests ou entrar em contato com a equipe de desenvolvimento para colaborar.
