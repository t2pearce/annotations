using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.Documents.Client;
using System.Security.Claims;
using System.Collections.Generic;


namespace Microsoft.Function
{
    
        public class QuestionsItem 
        {
            [JsonProperty("imageid")]
            public string ImageId { get; set; }
            //[JsonProperty("QuestionsJson")]
            public object[] QuestionsJson { get; set; }
        }

        public class AnswersItem
        {
            [JsonProperty("imageid")]
            public string ImageId {get; set; }
            [JsonProperty("userid")]
            public string UserId {get; set;}
            public object[] AnswersJson {get; set;}
        }
        public class AnswersProps
        {
            [JsonProperty("answers")]
            public List<AnswersChoice> Answers {get; set;}
        }
        public class AnswersChoice
        {
            [JsonProperty("answertext")]
            public string AnswersText {get; set;}
        }
    
        public static class Questions 
        {
            [FunctionName("saveAnswers")]
        public static  void RunSave(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "questions/{imageId}")] HttpRequest req,
            [CosmosDB(
                databaseName: "medimages",
                collectionName: "Answers",
                ConnectionStringSetting = "CosmosDBConnection")
            ] out dynamic document,
            string imageId,
            ILogger log)
        {
            log.LogInformation($"C# save answers for {imageId}");
            document = null;

            // Verify identity
            ClaimsPrincipal principal = ClientPrincipal.Parse(req);
            if (!principal.IsInRole("contributor"))
                return;

            string userId = principal.Identity.Name;

            string requestBody = new StreamReader(req.Body).ReadToEnd();
            //var input = JsonConvert.SerializeObject(requestBody);
            var input = requestBody;

            document = new { id = userId, imageId = imageId, AnswersJson = input }; //new object[] { requestBody } };
        }
            [FunctionName("getQuestions")]
            public static async Task<IActionResult> RunGet(
                [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "questions/{imageId}")] HttpRequest req,
                [CosmosDB(
                    databaseName: "medimages",
                    collectionName: "Questions",
                    ConnectionStringSetting = "CosmosDBConnection")
                ]  DocumentClient client,
                string imageId,
                ILogger log)
            {
                log.LogInformation($"function GetQuestions {imageId}");

                // Verify identity
                ClaimsPrincipal principal = ClientPrincipal.Parse(req);
                if (!principal.IsInRole("contributor"))
                    return new UnauthorizedResult();

                string userId = principal.Identity.Name;
                QuestionsItem questions = null;
                try
                {
                    var response = await client.ReadDocumentAsync(
                        UriFactory.CreateDocumentUri("medimages", "Questions", imageId),
                        new RequestOptions { PartitionKey = new Microsoft.Azure.Documents.PartitionKey(imageId) });

                    questions = (QuestionsItem)(dynamic)response.Resource;
                    log.LogInformation($"function GetQuestions invoked {imageId} {questions}");

                } catch (Exception ) {
                    log.LogError($"Cant find Questions entry for {imageId} in cosmosdb");
                    return new NotFoundResult();
                }
                log.LogInformation($"Retrieved questions {questions.QuestionsJson}");
                if ( questions != null && questions.QuestionsJson != null && questions.QuestionsJson.Length > 0)
                  return new OkObjectResult(questions.QuestionsJson);
                else
                  return new NotFoundResult();
            }
        }
}
